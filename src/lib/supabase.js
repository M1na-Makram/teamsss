import { createClient } from '@supabase/supabase-js';

// Ensure these are in your .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.EXPO_PUBLIC_SUPABASE_URL; 
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || import.meta.env.EXPO_PUBLIC_SUPABASE_KEY;

export const createScopedSupabaseClient = (customToken) => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase URL or Key missing!');
    return null;
  }

  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${customToken}`
      }
    },
    // We are not using Supabase Auth (GoTrue) for session management, 
    // so we disable auto-refresh and persistence for this client to avoid confusion.
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
};
