const admin = require('../config/firebase');
const { getScopedSupabase } = require('../db/supabaseClient');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Firebase claims

    // Initialize scoped Supabase client for this user
    // This allows route handlers to just do `req.db.from('...').select()`
    // and automatically adhere to RLS for this user.
    try {
      req.db = getScopedSupabase(decodedToken.uid);
    } catch (e) {
      console.error('Failed to create scoped DB client:', e.message);
      // Fallback: If secret is missing, we might fail hard or allow proceed if the route doesn't need DB.
      // For strict mode, we should probably fail or at least warn.
      // Ensure we don't crash if it's just a config error but we want to debug.
      // But for production safety:
      // req.db = null; 
    }

    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = requireAuth;
