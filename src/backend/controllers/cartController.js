const cartService = require('../services/cartService');

class CartController {
  async getCart(req, res, next) {
    try {
      const userId = req.user.id;
      const cart = await cartService.getCart(userId);

      return res.status(200).json({
        message: 'Cart retrieved',
        data: cart
      });
    } catch (err) {
      next(err);
    }
  }

  async addToCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { product_id, quantity = 1 } = req.body;

      if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      if (quantity < 1 || quantity > 100) {
        return res.status(400).json({ error: 'Quantity must be between 1 and 100' });
      }

      await cartService.addToCart(userId, product_id, quantity);
      const cart = await cartService.getCart(userId);

      return res.status(200).json({
        message: 'Item added to cart',
        data: cart
      });
    } catch (err) {
      if (err.message.includes('Insufficient')) {
        return res.status(409).json({ error: err.message });
      }
      next(err);
    }
  }

  async updateCartItem(req, res, next) {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 0) {
        return res.status(400).json({ error: 'Valid quantity is required' });
      }

      await cartService.updateCartItem(userId, itemId, quantity);
      const cart = await cartService.getCart(userId);

      return res.status(200).json({
        message: 'Cart updated',
        data: cart
      });
    } catch (err) {
      if (err.message === 'Cart item not found') {
        return res.status(404).json({ error: err.message });
      }
      next(err);
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;

      await cartService.removeFromCart(userId, itemId);
      const cart = await cartService.getCart(userId);

      return res.status(200).json({
        message: 'Item removed from cart',
        data: cart
      });
    } catch (err) {
      if (err.message === 'Cart item not found') {
        return res.status(404).json({ error: err.message });
      }
      next(err);
    }
  }

  async clearCart(req, res, next) {
    try {
      const userId = req.user.id;
      await cartService.clearCart(userId);

      return res.status(200).json({
        message: 'Cart cleared',
        data: { items: [], subtotal: 0, tax: 0, total: 0, itemCount: 0 }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CartController();
