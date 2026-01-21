const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Load env vars
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET; 

// Validate variables before initialization to prevent crash
const canInitialize = SUPABASE_URL && SUPABASE_SERVICE_KEY;

if (!canInitialize) {
  console.error('CRITICAL ERROR: Supabase client cannot be initialized due to missing variables.');
  console.error('Please ensure the following are set in your environment (Dashbord or .env):');
  console.error('- SUPABASE_URL (or VITE_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_URL)');
  console.error('- SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY / VITE_SUPABASE_ANON_KEY)');
}

// 1. Service Role Client (for admin tasks / trusted backend ops if needed)
// Initialize as null if variables are missing to prevent immediate process crash
const adminSupabase = canInitialize ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null;

/**
 * Returns a Supabase client scoped to the verification firebase_uid.
 * This client sends a custom JWT signed with Supabase's secret,
 * claiming to be the user with `uid`.
 * 
 * @param {string} firebaseUid 
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
const createSupabaseToken = (firebaseUid) => {
  if (!JWT_SECRET) {
    throw new Error('Cannot create scoped client: SUPABASE_JWT_SECRET is not configured.');
  }

  const payload = {
    sub: firebaseUid,
    role: 'authenticated',
    aud: 'authenticated',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
  };

  return jwt.sign(payload, JWT_SECRET);
};

/**
 * Returns a Supabase client scoped to the verification firebase_uid.
 */
const getScopedSupabase = (firebaseUid) => {
  if (!canInitialize) return null;
  const token = createSupabaseToken(firebaseUid);

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
};

module.exports = {
  adminSupabase,
  getScopedSupabase,
  createSupabaseToken
};
