const admin = require('../config/firebase');
const { query } = require('../config/db');

const sendNotification = async (userId, type, title, body, metadata = {}) => {
  try {
    // 1. Store in PostgreSQL
    const notifRes = await query(
      'INSERT INTO notifications (user_id, type, title, body, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, type, title, body, JSON.stringify(metadata)]
    );

    // 2. Fetch user's FCM token and preferences
    const userRes = await query(
      'SELECT firebase_token FROM users WHERE id = $1',
      [userId]
    );
    const settingsRes = await query(
      'SELECT * FROM notification_settings WHERE user_id = $1',
      [userId]
    );

    const fcmToken = userRes.rows[0]?.firebase_token;
    const settings = settingsRes.rows[0];

    // Check preferences (Simplified logic)
    let shouldSend = true;
    if (settings) {
      if (type === 'team_request' && !settings.team_requests) shouldSend = false;
      if (type === 'admin_message' && !settings.admin_messages) shouldSend = false;
      if (type === 'new_team' && !settings.new_teams) shouldSend = false;
      if (type === 'rating' && !settings.ratings) shouldSend = false;
    }

    // 3. Send via FCM if token exists and preferences allow
    if (fcmToken && shouldSend) {
      const message = {
        notification: { title, body },
        data: { ...metadata, type },
        token: fcmToken,
      };

      await admin.messaging().send(message);
      console.log(`FCM sent to user ${userId}`);
    }

    return notifRes.rows[0].id;
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};

module.exports = { sendNotification };
