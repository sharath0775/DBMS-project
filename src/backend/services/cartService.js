const { CartItem, Product } = require('../models');
const constants = require('../../../config/constants');

class CartService {
  async getCart(userId) {
    const items = await CartItem.findAll({
      where: { user_id: userId },
      include: [{ 
        model: Product,
        attributes: ['id', 'name', 'price', 'image_url', 'stock']
      }]
    });

    // Calculate totals
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.quantity * item.Product.price;
    });

    const tax = Math.round(subtotal * constants.TAX_RATE);
    const total = subtotal + tax;

    return {
      items,
      subtotal,
      tax,
      total,
      itemCount: items.length
    };
  }

  async addToCart(userId, productId, quantity = 1) {
    // Check if product exists and has stock
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    // Check if item already in cart
    const existingItem = await CartItem.findOne({
      where: { user_id: userId, product_id: productId }
    });

    if (existingItem) {
      // Update quantity
      return await existingItem.update({
        quantity: existingItem.quantity + quantity
      });
    }

    // Add new item
    return await CartItem.create({
      user_id: userId,
      product_id: productId,
      quantity
    });
  }

  async updateCartItem(userId, itemId, quantity) {
    const item = await CartItem.findOne({
      where: { id: itemId, user_id: userId }
    });

    if (!item) {
      throw new Error('Cart item not found');
    }

    if (quantity <= 0) {
      await item.destroy();
      return null;
    }

    // Check stock
    const product = await Product.findByPk(item.product_id);
    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    return await item.update({ quantity });
  }

  async removeFromCart(userId, itemId) {
    const item = await CartItem.findOne({
      where: { id: itemId, user_id: userId }
    });

    if (!item) {
      throw new Error('Cart item not found');
    }

    await item.destroy();
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId) {
    await CartItem.destroy({ where: { user_id: userId } });
    return { message: 'Cart cleared' };
  }
}

module.exports = new CartService();
