const paymentService = require('../services/paymentService');
const QRCode = require('qrcode');
const env = require('../../../config/environment');

// In-memory store for pending UPI payment status tracking
const pendingPayments = new Map();

class PaymentController {
  async processPayment(req, res, next) {
    try {
      const { amount, payment_method, payment_details } = req.body;
      const result = await paymentService.processPayment({ amount, payment_method, payment_details });
      return res.status(200).json({ message: 'Payment processed', data: result });
    } catch (err) {
      next(err);
    }
  }

  async generateUPIQR(req, res, next) {
    try {
      const { amount, order_id } = req.body;
      const userId = req.user.id;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required' });
      }

      // Generate a unique transaction ID
      const transactionId = `UPI${Date.now()}${Math.floor(Math.random() * 10000)}`;

      // UPI deep link parameters (works with PhonePe, GPay, Paytm, etc.)
      const upiParams = new URLSearchParams({
        pa: 'novacart@ybl',           // UPI ID (merchant virtual payment address)
        pn: 'NovaCart Store',          // Payee name
        tn: `Order ${order_id || transactionId}`, // Transaction note
        am: amount.toString(),            // Amount
        cu: 'INR',                        // Currency
        tr: transactionId,                // Transaction reference
        tid: transactionId                // Transaction ID
      });

      const upiLink = `upi://pay?${upiParams.toString()}`;

      // Generate QR code as base64 data URL
      const qrCodeDataUrl = await QRCode.toDataURL(upiLink, {
        width: 300,
        margin: 2,
        color: { dark: '#1e293b', light: '#ffffff' }
      });

      // PhonePe specific deep link (opens PhonePe app on mobile)
      const phonePeLink = `phonepe://pay?${upiParams.toString()}`;
      // Google Pay specific deep link
      const gpayLink = `gpay://upi/pay?${upiParams.toString()}`;
      // PhonePe web payment — uses the standard UPI intent URL
      // On desktop browsers this opens the OS UPI handler; on mobile opens app picker
      const phonePeWebLink = upiLink;

      // Store pending payment for status polling
      pendingPayments.set(transactionId, {
        status: 'pending',
        amount,
        userId,
        createdAt: Date.now()
      });

      // Auto-simulate payment after 15 seconds (for demo)
      // In production, this would be a webhook from the payment gateway
      setTimeout(() => {
        const payment = pendingPayments.get(transactionId);
        if (payment && payment.status === 'pending') {
          pendingPayments.set(transactionId, { ...payment, status: 'success', paidAt: Date.now() });
        }
      }, 15000);

      return res.status(200).json({
        message: 'UPI QR generated',
        data: {
          upiLink,
          phonePeLink,
          phonePeWebLink,
          gpayLink,
          qrCode: qrCodeDataUrl,
          transactionId,
          amount,
          upiId: 'novacart@ybl'
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async checkPaymentStatus(req, res, next) {
    try {
      const { transaction_id } = req.params;
      const payment = pendingPayments.get(transaction_id);

      if (!payment) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Clean up old entries (older than 10 minutes)
      const now = Date.now();
      for (const [key, value] of pendingPayments.entries()) {
        if (now - value.createdAt > 600000) {
          pendingPayments.delete(key);
        }
      }

      return res.status(200).json({
        message: 'Payment status retrieved',
        data: {
          transaction_id,
          status: payment.status,
          amount: payment.amount,
          paidAt: payment.paidAt || null
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyUPIPayment(req, res, next) {
    try {
      const { transaction_id, status } = req.body;

      // Mark the payment as success in our tracking store
      const payment = pendingPayments.get(transaction_id);
      if (payment) {
        pendingPayments.set(transaction_id, { ...payment, status: 'success', paidAt: Date.now() });
      }

      // In production, you'd verify with the payment gateway
      // For demo, we simulate a successful payment verification
      const paymentResult = await paymentService.processPayment({
        amount: req.body.amount || 0,
        payment_method: 'upi',
        payment_details: {
          transaction_id,
          status: status || 'success',
          upi_id: req.body.upi_id || 'novacart@ybl'
        }
      });

      return res.status(200).json({
        message: 'Payment verified',
        data: paymentResult
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PaymentController();