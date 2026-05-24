const { CartItem, Product, Order, OrderItem, Payment, sequelize } = require('../models');
const { generateOrderNumber } = require('../utils/formatters');
const constants = require('../../../config/constants');

class OrderService {
  async createOrder(userId, orderData) {
    const transaction = await sequelize.transaction();

    try {
      // Get cart items within the transaction
      const cartItems = await CartItem.findAll({
        where: { user_id: userId },
        include: [Product],
        transaction
      });

      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // Calculate totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of cartItems) {
        const itemTotal = item.quantity * item.Product.price;
        subtotal += itemTotal;

        orderItems.push({
          product_id: item.product_id,
          product_name: item.Product.name,
          product_image: item.Product.image_url,
          quantity: item.quantity,
          price_at_purchase: item.Product.price,
          subtotal: itemTotal
        });

        // Update product stock
        await item.Product.decrement('stock', { by: item.quantity, transaction });
      }

      // Calculate tax
      const taxAmount = Math.round(subtotal * constants.TAX_RATE);
      
      // Calculate discount
      let discountAmount = 0;
      if (orderData.coupon_code) {
        // Simple discount logic (can be enhanced with coupon validation)
        discountAmount = Math.round(subtotal * 0.1); // 10% discount
      }

      // Calculate shipping
      let shippingCost = constants.SHIPPING_COST_STANDARD;
      if (orderData.delivery_option === 'express') {
        shippingCost = constants.SHIPPING_COST_EXPRESS;
      }

      // Total
      const totalAmount = subtotal + taxAmount - discountAmount + shippingCost;

      // Create order
      const order = await Order.create({
        user_id: userId,
        order_number: `ORD${Date.now()}`,
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        shipping_cost: shippingCost,
        total_amount: totalAmount,
        coupon_code: orderData.coupon_code || null,
        delivery_address: orderData.delivery_address,
        delivery_city: orderData.delivery_city,
        delivery_state: orderData.delivery_state,
        delivery_pincode: orderData.delivery_pincode,
        phone_number: orderData.phone_number,
        delivery_option: orderData.delivery_option || 'standard',
        payment_method: orderData.payment_method || 'cod',
        status: 'ordered'
      }, { transaction });

      // Add order items
      const itemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: order.id
      }));
      await OrderItem.bulkCreate(itemsWithOrderId, { transaction });

      // Create payment record for non-COD payments
      if (orderData.payment_method && orderData.payment_method.toLowerCase() !== 'cod') {
        await Payment.create({
          user_id: userId,
          order_id: order.id,
          amount: totalAmount,
          payment_method: orderData.payment_method,
          status: 'paid',
          transaction_reference: `TXN${Date.now()}`
        }, { transaction });
      }

      // Clear cart
      await CartItem.destroy({ where: { user_id: userId }, transaction });

      // Commit transaction
      await transaction.commit();

      return order;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getUserOrders(userId, page = 1, limit = constants.DEFAULT_PAGE_SIZE) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      where: { user_id: userId },
      offset,
      limit,
      order: [['created_at', 'DESC']],
      include: [{ model: OrderItem }]
    });

    return {
      orders: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getOrderById(orderId, userId) {
    const order = await Order.findOne({
      where: { id: orderId, user_id: userId },
      include: [{ model: OrderItem, include: [Product] }]
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId, status) {
    const validStatuses = Object.values(constants.ORDER_STATUSES);
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await order.update({ status });
    return order;
  }

  async cancelOrder(orderId, userId) {
    const order = await Order.findOne(
      { where: { id: orderId, user_id: userId } }
    );

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'ordered') {
      throw new Error('Can only cancel orders with status "ordered"');
    }

    // Restore inventory
    const orderItems = await OrderItem.findAll(
      { where: { order_id: orderId } }
    );

    for (const item of orderItems) {
      const product = await Product.findByPk(item.product_id);
      await product.increment('stock', { by: item.quantity });
    }

    await order.update({ status: 'cancelled' });
    return order;
  }
}

module.exports = new OrderService();
