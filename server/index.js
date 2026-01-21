const path = require('path');
// Load env vars from local folder, then root folder as fallback
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API REQUEST] ${req.method} ${req.url}`);
  }
  next();
});

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://teamminy-81323.web.app',
  'https://teamminy-81323.firebaseapp.com',
  'https://teamsss-production.up.railway.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('teamminy')) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Home route
app.get('/', (req, res) => {
  res.send("🔥 Backend is running!");
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Import Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const teamRoutes = require('./routes/teams');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize Realtime Notification Listener
  const { adminSupabase } = require('./db/supabaseClient');
  const { sendPushToUser, sendNotification } = require('./services/notificationService');

  console.log('Initializing Realtime Notification Listener...');
  
  if (adminSupabase) {
    // Listener for individual notifications
    adminSupabase
      .channel('server-notifications')
      .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications' 
      }, async (payload) => {
          const { user_id, title, body, metadata } = payload.new;
          console.log('New DB Notification detected:', title);
          await sendPushToUser(user_id, title, body, metadata || {});
      })
      .subscribe((status) => {
          console.log('Notification Listener Status:', status);
      });

    // Listener for admin broadcasts
    adminSupabase
      .channel('server-broadcasts')
      .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'admin_broadcasts' 
      }, async (payload) => {
          const { title, body, target_type, priority } = payload.new;
          console.log('[Broadcast] New admin broadcast detected:', title);
          
          try {
            // Get all users with FCM tokens
            let query = adminSupabase.from('profiles').select('id, fcm_token, role');
            
            if (target_type === 'students') {
              query = query.or('role.eq.user,role.is.null');
            } else if (target_type === 'leaders') {
              query = query.eq('role', 'leader');
            } else if (target_type === 'doctors') {
              query = query.eq('role', 'doctor');
            }
            
            const { data: users } = await query;
            const usersWithTokens = users?.filter(u => u.fcm_token) || [];
            
            console.log(`[Broadcast] Sending to ${usersWithTokens.length} users with FCM tokens`);
            
            // Send to each user
            for (const user of usersWithTokens) {
              await sendNotification(user.id, 'admin_broadcast', title, body, {
                priority: priority || 'normal',
                broadcastType: target_type || 'all'
              });
            }
            
            console.log(`[Broadcast] Completed sending to ${usersWithTokens.length} users`);
          } catch (error) {
            console.error('[Broadcast] Error sending broadcast notifications:', error.message);
          }
      })
      .subscribe((status) => {
          console.log('Broadcast Listener Status:', status);
      });
  } else {
    console.error('❌ Skipping Realtime Listener: adminSupabase not initialized (Missing Env Vars)');
  }
});

// Debug keep-alive
setInterval(() => {
  console.log('Keep-alive ping...');
}, 30000);

process.on('exit', (code) => {
  console.log(`Process about to exit with code: ${code}`);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Exiting...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
