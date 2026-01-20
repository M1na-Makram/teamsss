const { adminSupabase } = require('../db/supabaseClient');
const admin = require('../config/firebase');

const sendNotification = async (userId, type, title, body, metadata = {}) => {
  try {
    // 1. Save to Supabase (using Admin Client)
    const { data: notif, error: dbError } = await adminSupabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        body,
        metadata, // Correct column name is metadata
        read: false,
        created_at: new Date()
      })
      .select()
      .single();

    if (dbError) {
      console.error(`Supabase insert failed for user ${userId}:`, dbError.message);
    }

    // 2. Try to send push notification via FCM
    try {
      const { data: userProfile, error: profileError } = await adminSupabase
        .from('profiles')
        .select('fcm_token')
        .eq('id', userId) // Correct column name is id (renamed from firebase_uid)
        .single();
      
      const fcmToken = userProfile?.fcm_token;

      if (fcmToken) {
        const message = {
          notification: { title, body },
          data: { 
            ...Object.keys(metadata).reduce((acc, key) => {
              acc[key] = String(metadata[key]);
              return acc;
            }, {}),
            notificationId: notif ? notif.id : ''
          },
          token: fcmToken,
        };

        await admin.messaging().send(message);
      }
    } catch (fcmError) {
        console.error(`FCM failed for user ${userId}:`, fcmError.message);
    }

    return notif ? notif.id : null;
  } catch (error) {
    console.error(`Error sending notification to user ${userId}:`, error.message);
  }
};

const sendPushToUser = async (userId, title, body, metadata = {}) => {
  try {
      // 1. Get Token
      const { data: userProfile, error } = await adminSupabase
        .from('profiles')
        .select('fcm_token')
        .eq('id', userId) // Changed from firebase_uid to id as per MASTER_DB_FIX
        .single();
      
      const fcmToken = userProfile?.fcm_token;

      if (fcmToken) {
        const message = {
          notification: { title, body },
          data: { 
            ...Object.keys(metadata).reduce((acc, key) => {
              acc[key] = String(metadata[key]);
              return acc;
            }, {}),
            click_action: '/notifications'
          },
          token: fcmToken,
        };

        const response = await admin.messaging().send(message);
        console.log(`FCM sent to ${userId}:`, response);
        return response;
      } else {
          console.log(`No FCM token for user ${userId}`);
      }
  } catch (error) {
      console.error(`FCM send error for ${userId}:`, error.message);
  }
};

module.exports = { sendNotification, sendPushToUser };
