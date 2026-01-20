const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteAllNotifications, createNotification } = require('../controllers/notifications');
const { verifyAuth } = require('../middleware/auth');

router.get('/', verifyAuth, getNotifications);
router.get('/unread-count', verifyAuth, getUnreadCount);
router.put('/:id/read', verifyAuth, markAsRead);
router.put('/read-all', verifyAuth, markAllAsRead);
router.delete('/delete-all', verifyAuth, deleteAllNotifications);
router.post('/', verifyAuth, createNotification);

module.exports = router;
