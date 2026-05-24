class WishlistPage {
  constructor() {
    this.init();
  }

  async init() {
    const theme = StorageManager.getTheme();
    if (theme === 'dark') document.documentElement.classList.add('dark');

    const token = StorageManager.getAuthToken();
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    await this.loadWishlist();
  }

  async loadWishlist() {
    try {
      const items = await api.getWishlist();
      this.renderWishlist(items);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      Helpers.showToast('Error loading wishlist', 'error');
    }
  }

  renderWishlist(items) {
    const container = document.getElementById('wishlist-items');
    const emptyState = document.getElementById('wishlist-empty');

    if (!items || items.length === 0) {
      container.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = items.map(item => `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col lg:flex-row gap-6">
        <img src="${item.Product?.image_url || 'https://via.placeholder.com/200'}" alt="${item.Product?.name || 'Product'}" class="w-full lg:w-56 h-56 object-cover rounded-lg" />
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${item.Product?.name || 'Untitled product'}</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">${item.Product?.description || 'No description available.'}</p>
          <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <div><span class="font-semibold">Brand:</span> ${item.Product?.brand || 'N/A'}</div>
            <div><span class="font-semibold">Stock:</span> ${item.Product?.stock || 0}</div>
            <div><span class="font-semibold">Price:</span> ₹${((item.Product?.price || 0) / 100).toFixed(2)}</div>
            <div><span class="font-semibold">Rating:</span> ${item.Product?.rating?.toFixed(1) || '0.0'} ⭐</div>
          </div>
          <div class="flex flex-wrap gap-3">
            <button onclick="addToCartFromWishlist(${item.Product?.id})" class="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Add to Cart</button>
            <button onclick="removeFromWishlist(${item.Product?.id})" class="px-5 py-3 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

window.addToCartFromWishlist = async (productId) => {
  try {
    const product = await api.getProduct(productId);
    await api.addToCart(productId, 1);
    StorageManager.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1
    });
    Helpers.showToast('Added to cart!', 'success');
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (err) {
    console.error('Wishlist add to cart error:', err);
    Helpers.showToast('Unable to add item to cart', 'error');
  }
};

window.removeFromWishlist = async (productId) => {
  try {
    await api.removeFromWishlist(productId);
    Helpers.showToast('Removed from wishlist', 'success');
    const page = document.querySelector('html');
    if (page) {
      window.location.reload();
    }
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    Helpers.showToast('Unable to remove item', 'error');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new WishlistPage());
} else {
  new WishlistPage();
}
