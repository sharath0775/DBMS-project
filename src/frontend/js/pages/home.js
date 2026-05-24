// Home Page Logic
async function initHome() {
  try {
    // Apply theme
    const theme = StorageManager.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Load trending products
    const trendingContainer = document.getElementById('trending-products');
    const trending = await api.getTrendingProducts(8);
    if (trending && trending.length > 0) {
      trendingContainer.innerHTML = trending.map(p => ProductCard.render(p)).join('');
    } else {
      trendingContainer.innerHTML = '<p class="col-span-4 text-center text-gray-600">No trending products</p>';
    }

    // Load best sellers
    const bestsellersContainer = document.getElementById('bestsellers-products');
    const bestsellers = await api.getBestSellers(8);
    if (bestsellers && bestsellers.length > 0) {
      bestsellersContainer.innerHTML = bestsellers.map(p => ProductCard.render(p)).join('');
    } else {
      bestsellersContainer.innerHTML = '<p class="col-span-4 text-center text-gray-600">No best sellers yet</p>';
    }

    // Load flash sale products
    const flashSaleContainer = document.getElementById('flash-sale-products');
    const flashSale = await api.getProducts({ limit: 8, sort: 'price_asc' });
    if (flashSale?.products?.length > 0) {
      flashSaleContainer.innerHTML = flashSale.products.slice(0, 8).map(p => ProductCard.render(p)).join('');
    } else {
      flashSaleContainer.innerHTML = '<p class="col-span-4 text-center text-gray-600">No flash sale items available</p>';
    }

    // Load recommended products
    const recommendedContainer = document.getElementById('recommended-products');
    const recommended = await api.getProducts({ limit: 8, sort: 'newest' });
    if (recommended?.products?.length > 0) {
      recommendedContainer.innerHTML = recommended.products.slice(0, 8).map(p => ProductCard.render(p)).join('');
    } else {
      recommendedContainer.innerHTML = '<p class="col-span-4 text-center text-gray-600">No recommendations yet</p>';
    }

    // Load categories
    const categoriesContainer = document.getElementById('categories');
    const categories = await api.getCategories();
    if (categories && categories.length > 0) {
      categoriesContainer.innerHTML = categories.map(cat => `
        <a href="/products.html?category=${cat.id}" 
           class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center hover:shadow-lg transition cursor-pointer">
          <div class="text-4xl mb-2">${cat.icon || '🛍️'}</div>
          <p class="font-semibold text-sm line-clamp-2">${cat.name}</p>
        </a>
      `).join('');
    }

    // Newsletter subscriber action
    const subscribeButton = document.getElementById('subscribe-newsletter');
    if (subscribeButton) {
      subscribeButton.addEventListener('click', () => {
        const email = document.getElementById('newsletter-email').value;
        if (!email || !email.includes('@')) {
          Helpers.showToast('Please enter a valid email', 'error');
          return;
        }
        Helpers.showToast('Subscribed successfully!', 'success');
        document.getElementById('newsletter-email').value = '';
      });
    }
  } catch (err) {
    console.error('Error initializing home:', err);
    Helpers.showToast('Error loading page', 'error');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome);
} else {
  initHome();
}
