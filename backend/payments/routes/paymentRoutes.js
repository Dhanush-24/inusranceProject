const express = require('express');
const router = express.Router();
const { createOrder, verifyAndStorePayment, getPaymentDetailsByMobile } = require('../controllers/paymentController');

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyAndStorePayment);
// routes/paymentRoutes.js
router.get('/payment-details/:mobile', getPaymentDetailsByMobile);


module.exports = router;
