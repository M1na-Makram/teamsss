import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../services/api';

const NotificationPreferences = () => {
  const { userData, refreshUserData } = useAuth();
  const [preferences, setPreferences] = useState({
    teamRequests: true,
    adminMessages: true,
    newTeams: true,
    teamNeedsMembers: false,
    ratings: true,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userData?.settings) {
        // Use column names that match the database schema
        setPreferences({
            teamRequests: userData.settings.new_requests ?? true,
            adminMessages: userData.settings.push_notifications ?? true,
            newTeams: userData.settings.team_updates ?? true,
            teamNeedsMembers: false, // Not in current schema
            ratings: userData.settings.email_notifications ?? true,
        });
    }
  }, [userData]);

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        // Since profileApi.completeProfile or update handles settings too, 
        // but here we might need a dedicated settings update if we had one.
        // For now, we'll use a direct upsert in api if available or mock it.
        // Let's assume completeProfile logic can be repurposed or we add updateProfile.
        
        const { supabase } = await import('../../lib/supabaseClient');
        const { data: { user } } = await supabase.auth.getUser();
        
        // Use column names that match the database schema
        const { error } = await supabase.from('notification_settings').upsert({
            user_id: user.id,
            new_requests: preferences.teamRequests,
            push_notifications: preferences.adminMessages,
            team_updates: preferences.newTeams,
            email_notifications: preferences.ratings
        }, { onConflict: 'user_id' });

        if (error) {
            console.error('Upsert error:', error);
            throw error;
        }

        await refreshUserData();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    } catch (error) {
        console.error('Failed to save preferences:', error);
        alert('Failed to save preferences');
    } finally {
        setSaving(false);
    }
  };

  const options = [
    { key: 'teamRequests', label: 'Team join requests' },
    { key: 'adminMessages', label: 'Admin announcements' },
    { key: 'newTeams', label: 'New teams in my courses' },
    { key: 'teamNeedsMembers', label: 'Teams looking for members' },
    { key: 'ratings', label: 'Teammate rating reminders' },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Notification Preferences</h3>
      </div>

      <div className="space-y-4 mb-6">
        {options.map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
            <button
              onClick={() => handleToggle(key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences[key] ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences[key] ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
            saved ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-primary hover:bg-primary/90 text-white'
        }`}
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : saved ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Preferences Saved
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Preferences
          </>
        )}
      </button>
    </div>
  );
};

export default NotificationPreferences;
