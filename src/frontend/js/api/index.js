// API Client - Handles all API communication
class APIClient {
  constructor() {
    this.baseURL = '/api';
    this.token = StorageManager.getAuthToken();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          StorageManager.clear();
          window.location.href = '/login.html';
          throw new Error('Please login again');
        }
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      const data = await response.json();
      return data.data || data;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }

  setToken(token) {
    this.token = token;
    StorageManager.setAuthToken(token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Auth endpoints
  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getMe() {
    return this.request('/auth/me', { method: 'GET' });
  }

  async updateProfile(data) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Product endpoints
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return this.request(`/products?${params.toString()}`, { method: 'GET' });
  }

  async getProduct(id) {
    return this.request(`/products/${id}`, { method: 'GET' });
  }

  async searchProducts(query, limit = 10) {
    return this.request(`/products/search/${encodeURIComponent(query)}?limit=${limit}`, { method: 'GET' });
  }

  async getCategories() {
    return this.request('/products/categories', { method: 'GET' });
  }

  async getTrendingProducts(limit = 10) {
    return this.request(`/products/trending?limit=${limit}`, { method: 'GET' });
  }

  async getBestSellers(limit = 10) {
    return this.request(`/products/best-sellers?limit=${limit}`, { method: 'GET' });
  }

  // Review endpoints
  async getProductReviews(productId) {
    return this.request(`/reviews/${productId}`, { method: 'GET' });
  }

  async addProductReview(productId, rating, title, comment) {
    return this.request(`/reviews/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ rating, title, comment })
    });
  }

  // Payments
  async processPayment(paymentData) {
    return this.request('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request('/admin/dashboard', { method: 'GET' });
  }

  async getAdminProducts(page = 1, limit = 20, search = '') {
    return this.request(`/admin/products?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`, { method: 'GET' });
  }

  async createAdminProduct(payload) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateAdminProduct(id, payload) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async deleteAdminProduct(id) {
    return this.request(`/admin/products/${id}`, { method: 'DELETE' });
  }

  async getAdminInventory() {
    return this.request('/admin/inventory', { method: 'GET' });
  }

  async updateAdminInventory(productId, payload) {
    return this.request(`/admin/inventory/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async getAdminOrders(page = 1, limit = 20) {
    return this.request(`/admin/orders?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  async updateAdminOrderStatus(id, status) {
    return this.request(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart', { method: 'GET' });
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity })
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/${itemId}`, { method: 'DELETE' });
  }

  async clearCart() {
    return this.request('/cart', { method: 'DELETE' });
  }

  // Wishlist endpoints
  async getWishlist() {
    return this.request('/wishlist', { method: 'GET' });
  }

  async addToWishlist(productId) {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId })
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/wishlist/${productId}`, { method: 'DELETE' });
  }

  async checkWishlist(productId) {
    return this.request(`/wishlist/check/${productId}`, { method: 'GET' });
  }

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getOrders(page = 1, limit = 20) {
    return this.request(`/orders?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`, { method: 'GET' });
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel`, { method: 'PUT' });
  }
}

// Create global API instance
const api = new APIClient();
if (typeof window !== 'undefined') {
  window.api = api;
}
