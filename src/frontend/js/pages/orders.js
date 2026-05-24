// Orders Page Logic
class OrdersPage {
  constructor() {
    this.init();
  }

  async init() {
    // Apply theme
    const theme = StorageManager.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Check authentication
    const token = StorageManager.getAuthToken();
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    await this.loadOrders();
  }

  async loadOrders() {
    try {
      const loading = document.getElementById('loading');
      loading.style.display = 'block';

      const result = await api.getOrders();
      loading.style.display = 'none';

      const container = document.getElementById('orders-container');
      const noOrders = document.getElementById('no-orders');

      if (result.orders && result.orders.length > 0) {
        noOrders.style.display = 'none';
        container.innerHTML = result.orders.map(order => this.renderOrder(order)).join('');
      } else {
        container.innerHTML = '';
        noOrders.style.display = 'block';
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      Helpers.showToast('Error loading orders', 'error');
      document.getElementById('loading').style.display = 'none';
    }
  }

  renderOrder(order) {
    const statusColors = {
      ordered: 'text-blue-600 bg-blue-100',
      packed: 'text-purple-600 bg-purple-100',
      shipped: 'text-orange-600 bg-orange-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };

    return `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="font-bold text-lg">${order.order_number}</p>
            <p class="text-gray-600 dark:text-gray-400">${Helpers.formatDate(order.created_at)}</p>
          </div>
          <span class="px-4 py-2 rounded-full font-semibold text-sm ${statusColors[order.status] || 'bg-gray-100'}">
            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div class="mb-4 border-t dark:border-gray-700 pt-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Items: ${order.OrderItems?.length || 0}</p>
          <div class="flex flex-wrap gap-2 mb-3">
            ${order.OrderItems?.slice(0, 3).map(item => `
              <img src="${item.product_image}" alt="" class="w-12 h-12 object-cover rounded" title="${item.product_name}">
            `).join('')}
            ${order.OrderItems?.length > 3 ? `<div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-sm font-bold">+${order.OrderItems.length - 3}</div>` : ''}
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
          <p class="text-2xl font-bold">₹${(order.total_amount / 100).toFixed(2)}</p>
        </div>

        <div class="flex gap-2">
          <button onclick="window.location.href='/order-detail.html?id=${order.id}'" class="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            View Details
          </button>
          ${order.status === 'ordered' ? `
            <button onclick="cancelOrder(${order.id})" class="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-200 transition">
              Cancel Order
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }
}

// Global function
window.cancelOrder = async (orderId) => {
  if (confirm('Are you sure you want to cancel this order?')) {
    try {
      Helpers.showLoader();
      await api.cancelOrder(orderId);
      Helpers.hideLoader();
      Helpers.showToast('Order cancelled successfully', 'success');
      location.reload();
    } catch (err) {
      Helpers.hideLoader();
      Helpers.showToast('Error cancelling order', 'error');
    }
  }
};

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new OrdersPage());
} else {
  new OrdersPage();
}
