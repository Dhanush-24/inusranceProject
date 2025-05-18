const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, addUserDetails ,checkMobile,getUserDashboard } = require('../controllers/authController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/add-details', addUserDetails);
router.get('/dashboard/:mobile', getUserDashboard);
router.post('/check-mobile', checkMobile);

module.exports = router;
