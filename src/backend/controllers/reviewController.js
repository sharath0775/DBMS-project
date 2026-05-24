const reviewService = require('../services/reviewService');

class ReviewController {
  async getReviews(req, res, next) {
    try {
      const productId = req.params.productId;
      const reviews = await reviewService.getProductReviews(productId);
      return res.status(200).json({ message: 'Reviews retrieved', data: reviews });
    } catch (err) {
      next(err);
    }
  }

  async addReview(req, res, next) {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;
      const { rating, title, comment } = req.body;
      const review = await reviewService.addReview(userId, productId, { rating, title, comment });
      return res.status(201).json({ message: 'Review submitted', data: review });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReviewController();