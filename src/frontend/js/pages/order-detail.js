class OrderDetailPage {
  constructor() {
    this.orderId = Helpers.getQueryParam('id');
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

    if (!this.orderId) {
      window.location.href = '/orders.html';
      return;
    }

    await this.loadOrder();
  }

  async loadOrder() {
    try {
      const order = await api.getOrder(this.orderId);
      this.renderOrder(order);
    } catch (err) {
      console.error('Error loading order:', err);
      Helpers.showToast('Unable to load order details', 'error');
      window.location.href = '/orders.html';
    }
  }

  renderOrder(order) {
    const container = document.getElementById('order-detail-container');
    const itemsHtml = order.OrderItems?.map(item => `
      <div class="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 py-4">
        <img src="${item.product_image}" alt="${item.product_name}" class="w-24 h-24 object-cover rounded-lg" />
        <div class="flex-1">
          <p class="font-semibold text-lg text-gray-900 dark:text-white">${item.product_name}</p>
          <p class="text-gray-600 dark:text-gray-400">Qty: ${item.quantity}</p>
          <p class="text-gray-600 dark:text-gray-400">Price: ₹${(item.price_at_purchase / 100).toFixed(2)}</p>
        </div>
        <p class="font-bold text-gray-900 dark:text-white">₹${(item.subtotal / 100).toFixed(2)}</p>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
        <div class="flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order ${order.order_number}</h2>
            <p class="text-gray-600 dark:text-gray-400">Placed on ${Helpers.formatDate(order.created_at)}</p>
          </div>
          <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${this.getStatusClasses(order.status)}">
            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Shipping Address</h3>
            <p class="text-gray-600 dark:text-gray-300">${order.delivery_address}</p>
            <p class="text-gray-600 dark:text-gray-300">${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}</p>
            <p class="text-gray-600 dark:text-gray-300 mt-2">Phone: ${order.phone_number}</p>
            <p class="text-gray-600 dark:text-gray-300 mt-2">Delivery option: ${order.delivery_option}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h3>
            <p class="text-gray-600 dark:text-gray-300">Subtotal: ₹${(order.subtotal / 100).toFixed(2)}</p>
            <p class="text-gray-600 dark:text-gray-300">Tax: ₹${(order.tax_amount / 100).toFixed(2)}</p>
            <p class="text-gray-600 dark:text-gray-300">Shipping: ₹${(order.shipping_cost / 100).toFixed(2)}</p>
            <p class="text-gray-600 dark:text-gray-300">Discount: ₹${(order.discount_amount / 100).toFixed(2)}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white mt-4">Total: ₹${(order.total_amount / 100).toFixed(2)}</p>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Payment: ${order.payment_method}</p>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Items</h3>
          ${itemsHtml}
        </div>

        <div class="flex flex-col md:flex-row gap-4">
          <button onclick="window.location.href='/products.html'" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Continue Shopping</button>
          ${order.status === 'ordered' ? `<button onclick="cancelOrder(${order.id})" class="flex-1 bg-red-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-200 transition">Cancel Order</button>` : ''}
        </div>
      </div>
    `;
  }

  getStatusClasses(status) {
    const map = {
      ordered: 'bg-blue-100 text-blue-700',
      packed: 'bg-purple-100 text-purple-700',
      shipped: 'bg-orange-100 text-orange-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }
}

window.cancelOrder = async (orderId) => {
  if (!confirm('Are you sure you want to cancel this order?')) return;

  try {
    Helpers.showLoader();
    await api.cancelOrder(orderId);
    Helpers.hideLoader();
    Helpers.showToast('Order cancelled successfully', 'success');
    window.location.reload();
  } catch (err) {
    Helpers.hideLoader();
    console.error('Order cancellation error:', err);
    Helpers.showToast('Unable to cancel order', 'error');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new OrderDetailPage());
} else {
  new OrderDetailPage();
}
