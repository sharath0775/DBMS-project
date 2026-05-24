const wishlistService = require('../services/wishlistService');

class WishlistController {
  async getWishlist(req, res, next) {
    try {
      const userId = req.user.id;
      const items = await wishlistService.getWishlist(userId);

      return res.status(200).json({
        message: 'Wishlist retrieved',
        data: items
      });
    } catch (err) {
      next(err);
    }
  }

  async addToWishlist(req, res, next) {
    try {
      const userId = req.user.id;
      const { product_id } = req.body;

      if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      await wishlistService.addToWishlist(userId, product_id);
      const items = await wishlistService.getWishlist(userId);

      return res.status(200).json({
        message: 'Item added to wishlist',
        data: items
      });
    } catch (err) {
      if (err.message.includes('already in')) {
        return res.status(409).json({ error: err.message });
      }
      next(err);
    }
  }

  async removeFromWishlist(req, res, next) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      await wishlistService.removeFromWishlist(userId, productId);
      const items = await wishlistService.getWishlist(userId);

      return res.status(200).json({
        message: 'Item removed from wishlist',
        data: items
      });
    } catch (err) {
      if (err.message === 'Item not found in wishlist') {
        return res.status(404).json({ error: err.message });
      }
      next(err);
    }
  }

  async checkWishlist(req, res, next) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      const isInWishlist = await wishlistService.isInWishlist(userId, productId);

      return res.status(200).json({
        message: 'Wishlist status retrieved',
        data: { isInWishlist }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new WishlistController();
