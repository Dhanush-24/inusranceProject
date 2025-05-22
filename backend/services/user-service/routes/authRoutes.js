const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserDashboard } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/dashboard/:mobile', getUserDashboard)

module.exports = router;

