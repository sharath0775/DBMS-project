const productService = require('../services/productService');

class ProductController {
  async getProducts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      const filters = {
        category_id: req.query.category_id ? parseInt(req.query.category_id) : null,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice) : null,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice) : null,
        rating: req.query.rating ? parseInt(req.query.rating) : null,
        brand: req.query.brand,
        search: req.query.search,
        sort: req.query.sort
      };

      const result = await productService.getProducts(page, limit, filters);

      return res.status(200).json({
        message: 'Products retrieved',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      return res.status(200).json({
        message: 'Product retrieved',
        data: product
      });
    } catch (err) {
      if (err.message === 'Product not found') {
        return res.status(404).json({ error: err.message });
      }
      next(err);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const { query } = req.params;
      const limit = req.query.limit || 10;

      if (!query || query.length < 2) {
        return res.status(400).json({ error: 'Search query must be at least 2 characters' });
      }

      const products = await productService.searchProducts(query, limit);

      return res.status(200).json({
        message: 'Search results',
        data: products
      });
    } catch (err) {
      next(err);
    }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await productService.getCategories();

      return res.status(200).json({
        message: 'Categories retrieved',
        data: categories
      });
    } catch (err) {
      next(err);
    }
  }

  async getTrendingProducts(req, res, next) {
    try {
      const limit = req.query.limit || 10;
      const products = await productService.getTrendingProducts(limit);

      return res.status(200).json({
        message: 'Trending products retrieved',
        data: products
      });
    } catch (err) {
      next(err);
    }
  }

  async getBestSellers(req, res, next) {
    try {
      const limit = req.query.limit || 10;
      const products = await productService.getBestSellers(limit);

      return res.status(200).json({
        message: 'Best sellers retrieved',
        data: products
      });
    } catch (err) {
      next(err);
    }
  }

  async getOfferProducts(req, res, next) {
    try {
      const limit = req.query.limit || 20;
      const products = await productService.getOfferProducts(limit);

      return res.status(200).json({
        message: 'Offer products retrieved',
        data: products
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
