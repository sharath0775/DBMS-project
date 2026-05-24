const orderService = require('../services/orderService');

class OrderController {
  async createOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const orderData = req.body;

      const requiredFields = [
        'delivery_address', 
        'delivery_city', 
        'delivery_state', 
        'delivery_pincode', 
        'phone_number',
        'payment_method'
      ];

      for (const field of requiredFields) {
        if (!orderData[field]) {
          return res.status(400).json({ error: `${field} is required` });
        }
      }

      const order = await orderService.createOrder(userId, orderData);

      return res.status(201).json({
        message: 'Order created successfully',
        data: {
          id: order.id,
          order_number: order.order_number,
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at
        }
      });
    } catch (err) {
      if (err.message === 'Cart is empty') {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await orderService.getUserOrders(userId, page, limit);

      return res.status(200).json({
        message: 'Orders retrieved',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const order = await orderService.getOrderById(id, userId);

      return res.status(200).json({
        message: 'Order retrieved',
        data: order
      });
    } catch (err) {
      if (err.message === 'Order not found') {
        return res.status(404).json({ error: err.message });
      }
      next(err);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const order = await orderService.cancelOrder(id, userId);

      return res.status(200).json({
        message: 'Order cancelled',
        data: {
          id: order.id,
          order_number: order.order_number,
          status: order.status
        }
      });
    } catch (err) {
      if (err.message === 'Order not found' || err.message.includes('Can only cancel')) {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  }
}

module.exports = new OrderController();
