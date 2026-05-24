// Navbar Component
class Navbar {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.init();
  }

  init() {
    this.render();
    this.attachListeners();
    this.updateCartBadge();
  }

  render() {
    const user = StorageManager.getUser();
    const token = StorageManager.getAuthToken();
    const cartCount = StorageManager.getCart().length;

    this.navbar.innerHTML = `
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <!-- Logo -->
        <a href="/" class="text-2xl font-bold text-blue-600">NovaCart</a>

        <!-- Search Bar -->
        <div class="hidden md:block flex-1 mx-8">
          <div class="relative">
            <input 
              type="text" 
              id="search-input"
              placeholder="Search products..." 
              class="w-full px-4 py-2 border rounded-full dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div id="search-suggestions" class="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-2 hidden z-40 max-h-96 overflow-y-auto"></div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-4">
          <!-- Dark Mode Toggle -->
          <button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            🌙
          </button>

          <!-- Wishlist -->
          <a href="/wishlist.html" class="relative hover:text-blue-600 transition">
            ❤️
            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
          </a>

          <!-- Cart -->
          <a href="/cart.html" class="relative hover:text-blue-600 transition">
            🛒
            <span class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" id="cart-badge">${cartCount}</span>
          </a>

          <!-- Auth Section -->
          <div id="auth-section" class="flex gap-2">
            ${token ? `
              <div class="relative group">
                <button class="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold">
                  ${user?.name || 'Account'} ▼
                </button>
                <div class="hidden group-hover:block absolute right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50 min-w-[180px]">
                  <a href="/profile.html" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
                  <a href="/orders.html" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Orders</a>
                  ${user?.role === 'admin' ? `<a href="/admin-dashboard.html" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Admin Dashboard</a>` : ''}
                  <hr class="my-1 dark:border-gray-700">
                  <button id="logout-btn" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                </div>
              </div>
            ` : `
              <a href="/login.html" class="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold">Login</a>
              <a href="/register.html" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">Register</a>
            `}
          </div>
        </div>
      </div>
    `;
  }

  attachListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', Helpers.debounce((e) => this.handleSearch(e), 300));
    }

    // Listen for cart updates
    window.addEventListener('cartUpdated', () => this.updateCartBadge());
  }

  toggleTheme() {
    const html = document.documentElement;
    const currentTheme = StorageManager.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    StorageManager.setTheme(newTheme);
    html.classList.toggle('dark');
    
    document.getElementById('theme-toggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }

  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = StorageManager.getCart().length;
      badge.textContent = count;
    }
  }

  async handleSearch(e) {
    const query = e.target.value.trim();
    const suggestionsDiv = document.getElementById('search-suggestions');

    if (query.length < 2) {
      suggestionsDiv.classList.add('hidden');
      return;
    }

    try {
      const results = await api.searchProducts(query, 5);
      if (results.length > 0) {
        suggestionsDiv.innerHTML = results.map(p => `
          <a href="/product-detail.html?id=${p.id}" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
            <div class="flex gap-2">
              <img src="${p.image_url}" alt="" class="w-8 h-8 object-cover rounded">
              <div>
                <p class="font-semibold">${p.name}</p>
                <p class="text-gray-600 dark:text-gray-400">₹${(p.price / 100).toFixed(2)}</p>
              </div>
            </div>
          </a>
        `).join('');
        suggestionsDiv.classList.remove('hidden');
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  }

  logout() {
    StorageManager.clear();
    api.clearToken();
    window.location.href = '/login.html';
  }
}

// Initialize navbar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Navbar());
} else {
  new Navbar();
}
