// Helper Functions
class Helpers {
  static formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price / 100);
  }

  static formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static calculateDiscount(original, current) {
    if (original <= 0) return 0;
    return Math.round(((original - current) / original) * 100);
  }

  static showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast') || document.createElement('div');
    toast.id = 'toast';
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    }`;
    toast.textContent = message;
    toast.style.display = 'block';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.display = 'none';
    }, duration);
  }

  static showLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loader.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-300 mt-4">Loading...</p>
      </div>
    `;
    document.body.appendChild(loader);
  }

  static hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) loader.remove();
  }

  static debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  static renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalf) stars += '✨';
    return stars;
  }

  static calculateCartTotal(items) {
    let subtotal = 0;
    items.forEach(item => {
      subtotal += (item.price * item.quantity);
    });
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }
}

if (typeof window !== 'undefined') {
  window.Helpers = Helpers;
}
