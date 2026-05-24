const { Wishlist, Product } = require('../models');

class WishlistService {
  async getWishlist(userId) {
    const items = await Wishlist.findAll({
      where: { user_id: userId },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image_url', 'rating', 'stock']
      }],
      order: [['created_at', 'DESC']]
    });

    return items;
  }

  async addToWishlist(userId, productId) {
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId }
    });

    if (existing) {
      throw new Error('Product already in wishlist');
    }

    return await Wishlist.create({
      user_id: userId,
      product_id: productId
    });
  }

  async removeFromWishlist(userId, productId) {
    const item = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId }
    });

    if (!item) {
      throw new Error('Item not found in wishlist');
    }

    await item.destroy();
    return { message: 'Item removed from wishlist' };
  }

  async isInWishlist(userId, productId) {
    const item = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId }
    });

    return !!item;
  }
}

module.exports = new WishlistService();
