const express = require('express');
const router = express.Router();
const { completeProfile, getProfile } = require('../controllers/profile');
const { verifyAuth } = require('../middleware/auth');

router.post('/complete', verifyAuth, completeProfile);
router.post('/save-draft', verifyAuth, require('../controllers/profile').saveDraft);
router.post('/validate-student-id', verifyAuth, require('../controllers/profile').validateStudentId);
router.get('/me', verifyAuth, getProfile);

module.exports = router;
