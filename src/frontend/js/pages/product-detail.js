// Product Detail Page Logic
class ProductDetailPage {
  constructor() {
    this.productId = Helpers.getQueryParam('id');
    this.product = null;
    this.init();
  }

  async init() {
    // Apply theme
    const theme = StorageManager.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    if (!this.productId) {
      window.location.href = '/products.html';
      return;
    }

    try {
      await this.loadProduct();
      this.attachListeners();
      this.updateWishlistButton();
    } catch (err) {
      console.error('Error loading product:', err);
      Helpers.showToast('Error loading product', 'error');
    }
  }

  async loadProduct() {
    this.product = await api.getProduct(this.productId);
    StorageManager.setRecentlyViewed(this.productId);

    // Update page title
    document.title = `${this.product.name} - NovaCart`;

    // Render product details
    document.getElementById('product-name').textContent = this.product.name;
    document.getElementById('product-description').textContent = this.product.description || 'No description available';
    document.getElementById('product-brand').textContent = this.product.brand || 'N/A';
    document.getElementById('product-category').textContent = this.product.Category?.name || 'N/A';
    document.getElementById('product-image').src = this.product.image_url || 'https://via.placeholder.com/400';
    document.getElementById('product-rating').textContent = (this.product.rating || 0).toFixed(1);
    document.getElementById('product-price').textContent = `₹${(this.product.price / 100).toFixed(2)}`;

    if (this.product.original_price) {
      document.getElementById('original-price').textContent = `₹${(this.product.original_price / 100).toFixed(2)}`;
      const discount = Helpers.calculateDiscount(this.product.original_price, this.product.price);
      document.getElementById('discount').textContent = `-${discount}%`;
    }

    const stockStatus = document.getElementById('stock-status');
    if (this.product.stock > 0) {
      stockStatus.textContent = `In Stock (${this.product.stock} available)`;
      stockStatus.className = 'text-lg font-semibold text-green-600 mb-4';
    } else {
      stockStatus.textContent = 'Out of Stock';
      stockStatus.className = 'text-lg font-semibold text-red-600 mb-4';
      document.getElementById('add-to-cart-btn').disabled = true;
    }

    // Render reviews
    this.renderReviews();
  }

  renderReviews() {
    const container = document.getElementById('reviews-container');
    if (this.product.Reviews && this.product.Reviews.length > 0) {
      container.innerHTML = this.product.Reviews.slice(0, 5).map(review => `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="font-bold">${review.User?.name || 'Anonymous'}</p>
              <p class="text-yellow-500">${Helpers.renderStars(review.rating)}</p>
            </div>
            ${review.verified_purchase ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Verified Purchase</span>' : ''}
          </div>
          <p class="text-gray-600 dark:text-gray-300">${review.comment || 'No comment'}</p>
          <p class="text-gray-400 text-sm mt-2">${Helpers.formatDate(review.created_at)}</p>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p class="text-gray-600 dark:text-gray-300 text-center py-8">No reviews yet</p>';
    }
  }

  attachListeners() {
    const qtyInput = document.getElementById('quantity');
    document.getElementById('qty-decrease').addEventListener('click', () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
    });
    document.getElementById('qty-increase').addEventListener('click', () => {
      qtyInput.value = Math.min(100, parseInt(qtyInput.value) + 1);
    });

    document.getElementById('add-to-cart-btn').addEventListener('click', () => this.addToCart());
    document.getElementById('wishlist-btn').addEventListener('click', () => this.toggleWishlist());

    const reviewStars = document.querySelectorAll('.review-star');
    reviewStars.forEach(star => {
      star.addEventListener('click', (e) => {
        e.preventDefault();
        const rating = parseInt(star.dataset.rating);
        document.getElementById('review-rating').value = rating;
        reviewStars.forEach(s => s.style.opacity = s.dataset.rating <= rating ? '1' : '0.5');
      });
    });

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => this.submitReview(e));
    }
  }

  async addToCart() {
    try {
      const token = StorageManager.getAuthToken();
      if (!token) {
        window.location.href = '/login.html';
        return;
      }

      const quantity = parseInt(document.getElementById('quantity').value);
      await api.addToCart(this.productId, quantity);

      // Also update local cart
      for (let i = 0; i < quantity; i++) {
        StorageManager.addToCart({
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          image_url: this.product.image_url,
          quantity: 1
        });
      }

      Helpers.showToast('Added to cart!', 'success');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      Helpers.showToast('Error adding to cart', 'error');
    }
  }

  async toggleWishlist() {
    try {
      const token = StorageManager.getAuthToken();
      if (!token) {
        window.location.href = '/login.html';
        return;
      }

      const btn = document.getElementById('wishlist-btn');
      if (btn.textContent.includes('❌')) {
        await api.removeFromWishlist(this.productId);
        btn.textContent = '❤️ Wishlist';
      } else {
        await api.addToWishlist(this.productId);
        btn.textContent = '❌ Remove from Wishlist';
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  }

  async updateWishlistButton() {
    try {
      const isInWishlist = await api.checkWishlist(this.productId);
      const btn = document.getElementById('wishlist-btn');
      if (isInWishlist.isInWishlist) {
        btn.textContent = '❌ Remove from Wishlist';
      }
    } catch (err) {
      // Ignore if not authenticated
    }
  }

  async submitReview(e) {
    e.preventDefault();
    try {
      const token = StorageManager.getAuthToken();
      if (!token) {
        window.location.href = '/login.html';
        return;
      }

      const rating = parseInt(document.getElementById('review-rating').value);
      const title = document.getElementById('review-title').value;
      const comment = document.getElementById('review-comment').value;

      if (!rating || !title || !comment) {
        Helpers.showToast('Please fill in all fields', 'error');
        return;
      }

      await api.addProductReview(this.productId, rating, title, comment);
      Helpers.showToast('Review submitted successfully!', 'success');
      
      document.getElementById('review-form').reset();
      document.querySelectorAll('.review-star').forEach(s => s.style.opacity = '0.5');
      
      await this.loadProduct();
    } catch (err) {
      Helpers.showToast(err.message || 'Error submitting review', 'error');
    }
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ProductDetailPage());
} else {
  new ProductDetailPage();
}
