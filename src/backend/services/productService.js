const { Product, Category, Review, sequelize } = require('../models');
const { Op } = require('sequelize');
const constants = require('../../../config/constants');

class ProductService {
  async getProducts(page = 1, limit = constants.DEFAULT_PAGE_SIZE, filters = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    // Category filter
    if (filters.category_id) {
      where.category_id = filters.category_id;
    }

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price[Op.gte] = filters.minPrice;
      if (filters.maxPrice) where.price[Op.lte] = filters.maxPrice;
    }

    // Rating filter
    if (filters.rating) {
      where.rating = { [Op.gte]: filters.rating };
    }

    // Brand filter
    if (filters.brand) {
      where.brand = filters.brand;
    }

    // Search filter
    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filters.search}%` } },
        { description: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    // Sorting
    let order = [['created_at', 'DESC']];
    if (filters.sort) {
      if (filters.sort === 'price_asc') order = [['price', 'ASC']];
      if (filters.sort === 'price_desc') order = [['price', 'DESC']];
      if (filters.sort === 'rating') order = [['rating', 'DESC']];
      if (filters.sort === 'newest') order = [['created_at', 'DESC']];
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      order,
      offset,
      limit,
      include: [{ model: Category, attributes: ['id', 'name'] }]
    });

    return {
      products: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getProductById(productId) {
    const product = await Product.findByPk(productId, {
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { 
          model: Review, 
          attributes: ['id', 'rating', 'title', 'comment', 'verified_purchase', 'created_at'],
          include: [{ model: sequelize.models.User, attributes: ['id', 'name'] }],
          limit: 10,
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async searchProducts(query, limit = 10) {
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
          { brand: { [Op.like]: `%${query}%` } }
        ]
      },
      limit,
      order: [['rating', 'DESC']],
      attributes: ['id', 'name', 'price', 'image_url', 'rating']
    });

    return products;
  }

  async getCategories() {
    return await Category.findAll({ order: [['name', 'ASC']] });
  }

  async getProductsByCategory(categoryId, limit = constants.DEFAULT_PAGE_SIZE) {
    return await Product.findAll({
      where: { category_id: categoryId },
      limit,
      order: [['rating', 'DESC']]
    });
  }

  async getTrendingProducts(limit = 10) {
    return await Product.findAll({
      order: [['rating', 'DESC'], ['num_reviews', 'DESC']],
      limit
    });
  }

  async getBestSellers(limit = 10) {
    return await sequelize.query(
      `SELECT p.*, COUNT(oi.id) as purchase_count
       FROM products p
       LEFT JOIN order_items oi ON p.id = oi.product_id
       GROUP BY p.id
       ORDER BY purchase_count DESC
       LIMIT :limit`,
      { replacements: { limit }, type: sequelize.QueryTypes.SELECT }
    );
  }

  async getOfferProducts(limit = 20) {
    return await Product.findAll({
      where: {
        discount_percent: { [Op.gt]: 0 }
      },
      order: [['discount_percent', 'DESC']],
      limit
    });
  }
}

module.exports = new ProductService();
