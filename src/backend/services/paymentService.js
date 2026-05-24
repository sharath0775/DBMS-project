const { Payment } = require('../models');

class PaymentService {
  async processPayment({ amount, payment_method, payment_details }) {
    const transactionReference = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const status = 'success';

    const payment = await Payment.create({
      order_id: null,
      amount,
      method: payment_method,
      status,
      transaction_reference: transactionReference,
      payment_details: JSON.stringify(payment_details || {})
    });

    return {
      paymentId: payment.id,
      transactionReference,
      status,
      message: 'Payment gateway simulated successfully'
    };
  }
}

module.exports = new PaymentService();
