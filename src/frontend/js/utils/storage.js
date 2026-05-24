// Storage Management - LocalStorage Wrapper
class StorageManager {
  static setCart(items) {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  static getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  static addToCart(product) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: product.quantity || 1
      });
    }
    
    this.setCart(cart);
    return cart;
  }

  static removeFromCart(productId) {
    const cart = this.getCart().filter(item => item.id !== productId);
    this.setCart(cart);
    return cart;
  }

  static updateCartQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
    }
    this.setCart(cart);
    return cart;
  }

  static clearCart() {
    localStorage.removeItem('cart');
  }

  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  static getAuthToken() {
    return localStorage.getItem('token');
  }

  static setTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  static getTheme() {
    return localStorage.getItem('theme') || 'light';
  }

  static setRecentlyViewed(productId) {
    let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    recent = recent.slice(0, 5);
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));
  }

  static getRecentlyViewed() {
    return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  }

  static clear() {
    localStorage.clear();
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}
