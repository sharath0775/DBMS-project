const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

router.get('/:productId', reviewController.getReviews);
router.post('/:productId', authMiddleware, reviewController.addReview);

module.exports = router;
