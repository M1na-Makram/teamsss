const admin = require('../config/firebase');
const { getScopedSupabase } = require('../db/supabaseClient');

const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  console.log('Verifying token:', idToken.substring(0, 20) + '...');

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Decoded token uid:', decodedToken.uid);
    req.user = decodedToken; // Firebase claims

    // Initialize scoped Supabase client for this user
    try {
      req.db = getScopedSupabase(decodedToken.uid);
      
      // Fetch user profile to hydrate req.dbUser
      const { data: profile, error } = await req.db
        .from('profiles')
        .select('*')
        .eq('firebase_uid', decodedToken.uid)
        .single();
        
      if (profile) {
        req.dbUser = profile;
        // Map 'id' to firebase_uid for compatibility if needed, though best to use firebase_uid explicitely.
        // Legacy code might use req.dbUser.id.
        req.dbUser.id = profile.firebase_uid;
      } else {
        // User authenticated in Firebase but not in Supabase profiles yet.
        // We allow this, but dbUser will be minimal.
        req.dbUser = { id: decodedToken.uid, email: decodedToken.email, role: 'user', profile_completed: false };
      }

    } catch (e) {
      console.error('Failed to create scoped DB client or fetch profile:', e.message);
      return res.status(500).json({ message: 'Database connection failed. Please contact admin.' });
    }

    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
};

const checkProfile = (req, res, next) => {
  if (!req.dbUser || !req.dbUser.profile_completed) {
    return res.status(403).json({ 
      message: 'Please complete your profile before creating a team.',
      code: 'PROFILE_INCOMPLETE'
    });
  }
  next();
};

const checkAdmin = (req, res, next) => {
  if (!req.dbUser || req.dbUser.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

module.exports = { verifyAuth, checkProfile, checkAdmin };
