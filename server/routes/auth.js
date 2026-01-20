const express = require('express');
const router = express.Router();
const { syncUser, updateFirebaseToken } = require('../controllers/auth');
const { verifyAuth } = require('../middleware/auth');

router.post('/sync', verifyAuth, syncUser);
router.post('/token', verifyAuth, updateFirebaseToken);

module.exports = router;
