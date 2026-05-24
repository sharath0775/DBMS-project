const { Review, Product, User } = require('../models');

class ReviewService {
  async getProductReviews(productId) {
    return await Review.findAll({
      where: { product_id: productId },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']]
    });
  }

  async addReview(userId, productId, { rating, title, comment }) {
    const review = await Review.create({
      user_id: userId,
      product_id: productId,
      rating,
      title,
      comment,
      verified_purchase: true
    });

    const product = await Product.findByPk(productId);
    if (product) {
      const totalReviews = product.num_reviews || 0;
      const currentRating = parseFloat(product.rating || 0);
      const newRating = ((currentRating * totalReviews) + rating) / (totalReviews + 1);
      await product.update({
        rating: parseFloat(newRating.toFixed(2)),
        num_reviews: totalReviews + 1
      });
    }

    return review;
  }
}

module.exports = new ReviewService();
