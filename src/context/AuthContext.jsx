import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { authApi, profileApi, notificationsApi } from '../services/api';
import { messaging } from '../firebase';
import { getToken, onMessage } from 'firebase/messaging';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const initializeMessaging = async (userId) => {
      // 1. Supabase Realtime for Notifications (In-App)
      const notifChannel = supabase
        .channel('public:notifications')
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications', 
            filter: `user_id=eq.${userId}` 
        }, (payload) => {
            console.log('New notification:', payload);
            setUnreadCount(prev => prev + 1);
        })
        .subscribe();

      // 2. Supabase Realtime for Profile Updates (for approval status changes)
      const profileChannel = supabase
        .channel(`public:profiles:${userId}`)
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'profiles', 
            filter: `id=eq.${userId}` 
        }, (payload) => {
            console.log('Profile updated:', payload);
            // Refresh user data when profile is updated (e.g., after admin approval)
            if (payload.new) {
                setUserData(prev => ({ ...prev, ...payload.new }));
            }
        })
        .subscribe();

      // 3. Firebase Cloud Messaging (Browser Push)
      try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
              const token = await getToken(messaging, { 
                  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY 
              });
              if (token) {
                  // Sync token to profile
                  await authApi.updateToken(token);
                  
                  // Setup foreground listener
                  onMessage(messaging, (payload) => {
                      console.log('Foreground push received:', payload);
                      setUnreadCount(prev => prev + 1);
                      // Optional: Show toast
                  });
              }
          }
      } catch (error) {
          console.warn('Push notification setup failed:', error);
      }

      return { notifChannel, profileChannel };
  };

  const refreshUserData = async () => {
    try {
      const { data: profile } = await profileApi.getMe();
      if (!profile) {
          console.warn('Profile record not found in Supabase for user.');
          setUserData(null);
          return null;
      }
      setUserData(profile);
      
      try {
          const { data: notifData } = await notificationsApi.getUnreadCount();
          setUnreadCount(notifData?.count || 0);
      } catch (e) {
          console.warn('Failed to fetch unread count:', e.message);
      }
      
      return profile;
    } catch (error) {
      console.error('Error refreshing user data:', error.message);
      setUserData(null);
      return null;
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  };

  const register = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName }
        }
    });
    if (error) throw error;
    return data.user;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error('Sign out error:', error);
    }
    setUserData(null);
    setCurrentUser(null);
  };

  useEffect(() => {
    let mounted = true;

    // 1. Check for existing session immediately on mount
    const checkInitialSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!mounted) return;
            
            if (session?.user) {
                setCurrentUser(session.user);
                // Await critical data before finishing loading
                // Sync and initialize (non-blocking errors)
                (async () => {
                    try {
                        await authApi.syncUser(session.user);
                    } catch (e) {
                        console.warn('SyncUser failed:', e);
                    }
                    try {
                        await refreshUserData();
                        await initializeMessaging(session.user.id);
                    } catch (e) {
                        console.error('Data initialization failed:', e);
                    }
                })();
            }
        } catch (err) {
            console.error('Initial session check error:', err);
        } finally {
            if (mounted) setLoading(false);
        }
    };

    checkInitialSession();

    // 2. Subscribe to auth changes (SIGNED_IN, SIGNED_OUT, etc)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        const user = session?.user || null;
        if (!mounted) return;

        console.log(`Auth Event: ${event}`, user?.id);

        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            setCurrentUser(user);
            if (user) {
                // Background sync prevents blocking UI
                (async () => {
                    try {
                        await authApi.syncUser(user);
                        await refreshUserData();
                        initializeMessaging(user.id);
                    } catch (err) {
                        console.error('Auth update error:', err);
                    }
                })();
            } else {
                setLoading(false);
            }
        } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
            setCurrentUser(null);
            setUserData(null);
            setUnreadCount(0);
            setLoading(false);
        } else {
            setLoading(false);
        }
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    unreadCount,
    login,
    register,
    signInWithGoogle,
    signOut,
    refreshUserData,
    supabase 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
