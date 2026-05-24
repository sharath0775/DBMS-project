const { Product, Category, Inventory, Order, OrderItem, User, Payment, sequelize } = require('../models');
const { Op } = require('sequelize');
const constants = require('../../../config/constants');

class AdminService {
  async getDashboardStats() {
    const [productCount, orderCount, userCount, revenueResult, inventoryTotal, paymentCount] = await Promise.all([
      Product.count(),
      Order.count(),
      User.count({ where: { role: constants.ROLES.USER } }),
      Order.sum('total_amount'),
      Inventory.sum('quantity'),
      Payment.count({ where: { status: 'success' } })
    ]);

    return {
      products: productCount || 0,
      orders: orderCount || 0,
      customers: userCount || 0,
      revenue: parseFloat(revenueResult || 0),
      inventory: inventoryTotal || 0,
      successfulPayments: paymentCount || 0
    };
  }

  async getProducts(page = 1, limit = 20, search = null) {
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      offset,
      limit,
      order: [['created_at', 'DESC']],
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Inventory, attributes: ['quantity', 'location'] }
      ]
    });

    return {
      products: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async createProduct(payload) {
    const product = await Product.create({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      original_price: payload.original_price || null,
      discount_percent: payload.discount_percent || 0,
      stock: payload.stock || 0,
      image_url: payload.image_url || null,
      category_id: payload.category_id,
      brand: payload.brand || null,
      rating: payload.rating || 0,
      num_reviews: payload.num_reviews || 0,
      sku: payload.sku || null
    });

    await Inventory.create({
      product_id: product.id,
      quantity: payload.stock || 0,
      location: payload.location || 'Main Warehouse'
    });

    return product;
  }

  async updateProduct(productId, payload) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.update({
      name: payload.name || product.name,
      description: payload.description || product.description,
      price: payload.price || product.price,
      original_price: payload.original_price !== undefined ? payload.original_price : product.original_price,
      discount_percent: payload.discount_percent !== undefined ? payload.discount_percent : product.discount_percent,
      stock: payload.stock !== undefined ? payload.stock : product.stock,
      image_url: payload.image_url || product.image_url,
      category_id: payload.category_id || product.category_id,
      brand: payload.brand || product.brand,
      rating: payload.rating !== undefined ? payload.rating : product.rating,
      sku: payload.sku || product.sku
    });

    if (payload.stock !== undefined) {
      const inventory = await Inventory.findOne({ where: { product_id: product.id } });
      if (inventory) {
        await inventory.update({ quantity: payload.stock });
      } else {
        await Inventory.create({ product_id: product.id, quantity: payload.stock, location: payload.location || 'Main Warehouse' });
      }
    }

    return product;
  }

  async deleteProduct(productId) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.destroy();
    return { message: 'Deleted' };
  }

  async getInventory() {
    return await Inventory.findAll({
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'image_url'] }],
      order: [['updated_at', 'DESC']]
    });
  }

  async updateInventory(productId, quantity, location) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    let inventory = await Inventory.findOne({ where: { product_id: productId } });
    if (!inventory) {
      inventory = await Inventory.create({ product_id: productId, quantity, location: location || 'Main Warehouse' });
    } else {
      await inventory.update({
        quantity: quantity !== undefined ? quantity : inventory.quantity,
        location: location || inventory.location,
        updated_at: new Date()
      });
    }

    await product.update({ stock: inventory.quantity });
    return inventory;
  }

  async getOrders(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Order.findAndCountAll({
      offset,
      limit,
      order: [['created_at', 'DESC']],
      include: [{ model: OrderItem }, { model: Payment }]
    });

    return {
      orders: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
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
}

module.exports = new AdminService();
