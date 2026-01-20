const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Load env vars
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET; 

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase Environment Variables!');
  console.error('URL:', SUPABASE_URL); // Debug
  console.error('KEY:', SUPABASE_SERVICE_KEY ? 'Present' : 'Missing');
}

if (!JWT_SECRET) {
  console.warn('WARNING: SUPABASE_JWT_SECRET is missing. Custom scoped tokens cannot be generated. RLS might fail or be bypassed if not careful.');
  console.error('JWT_SECRET Is Missing from env!');
} else {
    // console.log('JWT Secret loaded successfully');
}

// 1. Service Role Client (for admin tasks / trusted backend ops if needed)
const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
  };

  return jwt.sign(payload, JWT_SECRET);
};

/**
 * Returns a Supabase client scoped to the verification firebase_uid.
 */
const getScopedSupabase = (firebaseUid) => {
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
