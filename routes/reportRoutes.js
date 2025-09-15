const express = require('express');
const router = express.Router();
const reportCtrl = require('../controllers/reportController');

router.get('/users-with-roles', reportCtrl.usersWithRoles);
router.get('/users-with-profiles', reportCtrl.usersWithProfiles);
router.get('/roles-with-users', reportCtrl.rolesWithUsers);
router.get('/full-outer-profiles', reportCtrl.fullOuterJoinProfiles);
router.get('/cross-users-roles', reportCtrl.crossJoinUsersRoles);
router.get('/user-referrals', reportCtrl.userReferrals);
router.get('/latest-login', reportCtrl.latestLoginPerUser);

module.exports = router;
