const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const productRoutes = require('./products');
const cartRoutes = require('./cart');
const orderRoutes = require('./orders');
const wishlistRoutes = require('./wishlist');
const adminRoutes = require('./admin');
const paymentRoutes = require('./payments');
const reviewRoutes = require('./reviews');

// Register routes
router.use('/api/auth', authRoutes);
router.use('/api/products', productRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/wishlist', wishlistRoutes);
router.use('/api/payments', paymentRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/reviews', reviewRoutes);

// Health check endpoint
router.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

module.exports = router;
