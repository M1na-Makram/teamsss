const express = require('express');
const router = express.Router();
const { getTeams, createTeam, joinTeam, updateMemberStatus } = require('../controllers/teams');
const { verifyAuth, checkProfile } = require('../middleware/auth');

router.get('/', verifyAuth, getTeams);
router.post('/', verifyAuth, checkProfile, createTeam);
router.post('/:id/join', verifyAuth, checkProfile, joinTeam);
router.put('/members/status', verifyAuth, checkProfile, updateMemberStatus);

module.exports = router;
