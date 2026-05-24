const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/process', paymentController.processPayment);
router.post('/upi/generate-qr', paymentController.generateUPIQR);
router.get('/upi/status/:transaction_id', paymentController.checkPaymentStatus);
router.post('/upi/verify', paymentController.verifyUPIPayment);

module.exports = router;
