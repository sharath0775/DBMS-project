// Product Card Component
class ProductCard {
  static render(product) {
    const discount = Helpers.calculateDiscount(product.original_price || product.price, product.price);
    
    return `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden group cursor-pointer">
        <!-- Image -->
        <div class="relative overflow-hidden bg-gray-200 dark:bg-gray-700 h-48 flex items-center justify-center">
          <img src="${product.image_url || 'https://via.placeholder.com/300?text=Product'}" 
               alt="${product.name}" 
               class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
               onclick="window.location.href='/product-detail.html?id=${product.id}'">
          ${discount > 0 ? `<div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">-${discount}%</div>` : ''}
          <button class="absolute top-2 left-2 bg-white dark:bg-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition" 
                  onclick="addToWishlist(${product.id})">
            ❤️
          </button>
        </div>

        <!-- Info -->
        <div class="p-4">
          <p class="text-gray-600 dark:text-gray-400 text-sm">${product.brand || 'Brand'}</p>
          <h3 class="font-bold text-sm line-clamp-2 mb-2 min-h-9 cursor-pointer hover:text-blue-600"
              onclick="window.location.href='/product-detail.html?id=${product.id}'">
            ${product.name}
          </h3>

          <!-- Rating -->
          <div class="flex items-center mb-2">
            <span class="text-yellow-500 text-sm">${Helpers.renderStars(product.rating)}</span>
            <span class="text-gray-600 dark:text-gray-400 text-xs ml-1">(${product.num_reviews || 0})</span>
          </div>

          <!-- Price -->
          <div class="mb-3">
            <p class="text-xl font-bold text-blue-600">₹${(product.price / 100).toFixed(2)}</p>
            ${product.original_price ? `<p class="text-sm text-gray-500 line-through">₹${(product.original_price / 100).toFixed(2)}</p>` : ''}
          </div>

          <!-- Add to Cart Button -->
          <button onclick="addToCartFromCard(${product.id}, this)"
                  class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }
}

// Global functions
async function addToCartFromCard(productId, button) {
  try {
    const token = StorageManager.getAuthToken();
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    button.disabled = true;
    button.textContent = 'Adding...';

    await api.addToCart(productId, 1);
    const cart = StorageManager.getCart();
    const product = cart.find(item => item.id === productId) || { quantity: 1 };
    StorageManager.addToCart({ id: productId, quantity: 1 });

    Helpers.showToast('Added to cart!', 'success');
    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Add to Cart';
    }, 1000);
  } catch (err) {
    Helpers.showToast('Error adding to cart', 'error');
    button.disabled = false;
    button.textContent = 'Add to Cart';
  }
}

async function addToWishlist(productId) {
  try {
    const token = StorageManager.getAuthToken();
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    await api.addToWishlist(productId);
    Helpers.showToast('Added to wishlist!', 'success');
  } catch (err) {
    if (err.message.includes('already in')) {
      Helpers.showToast('Already in wishlist', 'info');
    } else {
      Helpers.showToast('Error adding to wishlist', 'error');
    }
  }
}

if (typeof window !== 'undefined') {
  window.ProductCard = ProductCard;
}
