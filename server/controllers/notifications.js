const { adminSupabase } = require('../db/supabaseClient');

const getNotifications = async (req, res) => {
  const db = req.db;
  const { uid } = req.user;

  try {
    // RLS ensures we only see our own
    const { data: notifications, error } = await db
      .from('notifications')
      .select('*')
      .eq('user_id', uid) // Redundant with RLS but good practice
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const markAsRead = async (req, res) => {
  const db = req.db;
  const notifId = req.params.id;

  try {
    const { error } = await db
      .from('notifications')
      .update({ read: true })
      .eq('id', notifId); // RLS prevents updating others' notifs

    if (error) throw error;

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const markAllAsRead = async (req, res) => {
  const db = req.db;
  const { uid } = req.user;

  try {
    const { error } = await db
      .from('notifications')
      .update({ read: true })
      .eq('user_id', uid)
      .eq('read', false);

    if (error) throw error;
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAllNotifications = async (req, res) => {
  const db = req.db;
  const { uid } = req.user;

  try {
    const { error } = await db
      .from('notifications')
      .delete()
      .eq('user_id', uid);

    if (error) throw error;
    
    res.json({ message: 'All notifications deleted' });
  } catch (error) {
    console.error('Error deleting all notifications:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUnreadCount = async (req, res) => {
  const db = req.db;
  const { uid } = req.user;

  try {
    // count uses HEAD or special count query
    const { count, error } = await db
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', uid)
      .eq('read', false);

    if (error) throw error;
    
    res.json({ count: count || 0 });
  } catch (error) {
    console.error('Error getting unread count:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createNotification = async (req, res) => {
  const { userId, type, title, body, metadata } = req.body;

  try {
    // Use adminSupabase to bypass RLS
    const { error } = await adminSupabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        body,
        metadata
      });

    if (error) throw error;
    
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.warn('Error sending notification (conflict ignored):', error.message);
    // If conflict, we still return 200 to client to avoid crashing/error states
    if (error.code === '409') {
        res.json({ message: 'Notification skipped (duplicate)' });
    } else {
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteAllNotifications, createNotification };
