const express = require('express');
const router = express.Router();
const { getStats, getUsers, broadcastNotification } = require('../controllers/admin');
const { verifyAuth, checkAdmin } = require('../middleware/auth');

router.use(verifyAuth);
router.use(checkAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.post('/broadcast', broadcastNotification);

module.exports = router;
