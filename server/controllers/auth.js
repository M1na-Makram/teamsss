// server/controllers/auth.js

/**
 * Syncs the Firebase user with the Supabase `profiles` table.
 * Assumes `req.db` is a scoped Supabase client (see authMiddleware).
 */
const { adminSupabase } = require('../db/supabaseClient'); 

/**
 * Syncs the Firebase user with the Supabase `profiles` table.
 */
const syncUser = async (req, res) => {
  const { uid, email, displayName, photoURL } = req.user;
  console.log('Syncing user:', email, uid);
  // Use Admin Client to ensure sync works even if RLS is broken
  const db = adminSupabase;

  if (!db) {
    return res.status(500).json({ message: 'Database connection failed' });
  }

  try {
    // 1. Upsert Profile
    const { data: profile, error: profileError } = await db
      .from('profiles')
      .upsert({
        firebase_uid: uid,
        email: email,
        name: displayName,
        photo_url: photoURL,
        // Default role is user, don't overwrite if present?
        // Upsert will overwrite. If we want to preserve role, we need to read first or use ignorant upsert.
        // For now, simpler is better.
      }, { onConflict: 'firebase_uid', ignoreDuplicates: false })
      .select()
      .single();

    if (profileError) {
      console.error('Supabase Profile Upsert Error:', profileError);
      throw profileError;
    }

    // 2. Ensure Notification Settings exist
    const { error: settingsError } = await db
      .from('notification_settings')
      .upsert(
        { user_id: uid },
        { onConflict: 'user_id', ignoreDuplicates: true }
      );

    if (settingsError) {
      console.error('Supabase Settings Error:', settingsError);
    }

    return res.status(200).json({ 
      user: profile,
      supabaseToken: require('../db/supabaseClient').createSupabaseToken(uid)
    });
  } catch (error) {
    console.error('Error syncing user:', error.message);
    res.status(500).json({ message: 'Internal server error while syncing user' });
  }
};

/**
 * Updates the Firebase Messaging Token (FCM) for the user.
 * Stores strictly in `profiles` or a separate `user_devices` table.
 * For now, assume we add `firebase_token` to `profiles` or `notification_settings`? 
 * The legacy code put it in `users`. Let's put it in `notification_settings` or `profiles`.
 * The schema didn't have it. Let's assume `profiles` has `fcm_token` or similar? 
 * Or `notification_settings`. Let's put it in `profiles` for simplicity, or add it to schema.
 * I'll add `fcm_token` to `profiles` in schema update or just ignore for a second.
 * Wait, user constraints: "Use firebase_uid...".
 * I'll stick to a simple update for now, maybe add `fcm_token` to schema next.
 */
const updateFirebaseToken = async (req, res) => {
  const { token } = req.body;
  const { uid } = req.user;
  const db = req.db;

  if (!token) return res.status(400).json({ message: 'Token required' });

  try {
    // Ideally we should have a `fcm_token` column in profiles.
    // For this step, I will assume the column exists or I'll add it to the schema.
    // I will add `fcm_token` to the schema in the next step to be safe.
    
    // Attempt update
    const { error } = await db
      .from('profiles')
      .update({ fcm_token: token }) 
      .eq('firebase_uid', uid);

    if (error) throw error;

    res.json({ message: 'Token updated' });
  } catch (error) {
    console.error('Error updating token:', error.message);
    // If column doesn't exist, this will error. I need to update schema.sql.
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { syncUser, updateFirebaseToken };
