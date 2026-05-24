const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public routes
router.get('/', productController.getProducts);
router.get('/trending', productController.getTrendingProducts);
router.get('/best-sellers', productController.getBestSellers);
router.get('/categories', productController.getCategories);
router.get('/search/:query', productController.searchProducts);
router.get('/:id', productController.getProduct);

module.exports = router;
