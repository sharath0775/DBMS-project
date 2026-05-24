const adminService = require('../services/adminService');

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      return res.status(200).json({ message: 'Dashboard metrics', data: stats });
    } catch (err) {
      next(err);
    }
  }

  async getProducts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || null;
      const products = await adminService.getProducts(page, limit, search);
      return res.status(200).json({ message: 'Products retrieved', data: products });
    } catch (err) {
      next(err);
    }
  }

  async createProduct(req, res, next) {
    try {
      const payload = req.body;
      const product = await adminService.createProduct(payload);
      return res.status(201).json({ message: 'Product created', data: product });
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const payload = req.body;
      const product = await adminService.updateProduct(productId, payload);
      return res.status(200).json({ message: 'Product updated', data: product });
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const productId = req.params.id;
      await adminService.deleteProduct(productId);
      return res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
      next(err);
    }
  }

  async getInventory(req, res, next) {
    try {
      const inventory = await adminService.getInventory();
      return res.status(200).json({ message: 'Inventory retrieved', data: inventory });
    } catch (err) {
      next(err);
    }
  }

  async updateInventory(req, res, next) {
    try {
      const productId = req.params.productId;
      const { quantity, location } = req.body;
      const inventory = await adminService.updateInventory(productId, quantity, location);
      return res.status(200).json({ message: 'Inventory updated', data: inventory });
    } catch (err) {
      next(err);
    }
  }

  async getOrders(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const orders = await adminService.getOrders(page, limit);
      return res.status(200).json({ message: 'Orders retrieved', data: orders });
    } catch (err) {
      next(err);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      const order = await adminService.updateOrderStatus(orderId, status);
      return res.status(200).json({ message: 'Order status updated', data: order });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();