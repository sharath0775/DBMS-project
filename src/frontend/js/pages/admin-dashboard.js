// Admin Dashboard Page Logic
class AdminDashboardPage {
  constructor() {
    this.init();
  }

  async init() {
    const theme = StorageManager.getTheme();
    if (theme === 'dark') document.documentElement.classList.add('dark');

    const token = StorageManager.getAuthToken();
    const user = StorageManager.getUser();
    if (!token || !user || user.role !== 'admin') {
      window.location.href = '/login.html';
      return;
    }

    this.attachListeners();
    await this.loadDashboard();
  }

  attachListeners() {
    document.getElementById('refresh-inventory').addEventListener('click', () => this.loadInventory());
  }

  async loadDashboard() {
    try {
      Helpers.showLoader();
      const stats = await api.getAdminDashboard();
      const orders = await api.getAdminOrders(1, 6);
      const products = await api.getAdminProducts(1, 6);
      const inventory = await api.getAdminInventory();
      Helpers.hideLoader();

      document.getElementById('stat-revenue').textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(stats.revenue);
      document.getElementById('stat-orders').textContent = stats.orders;
      document.getElementById('stat-inventory').textContent = stats.inventory;

      this.renderOrders(orders.orders || []);
      this.renderProducts((products.products || []).slice(0, 6));
      this.renderInventory(inventory || []);
    } catch (err) {
      Helpers.hideLoader();
      Helpers.showToast('Error loading dashboard', 'error');
      console.error(err);
    }
  }

  renderOrders(orders) {
    const tbody = document.getElementById('admin-orders-table');
    tbody.innerHTML = orders.map(order => `
      <tr class="border-b border-gray-200 dark:border-gray-700">
        <td class="px-4 py-4 font-semibold">${order.order_number}</td>
        <td class="px-4 py-4 text-sm">${order.status}</td>
        <td class="px-4 py-4">₹${parseFloat(order.total_amount).toFixed(2)}</td>
        <td class="px-4 py-4">${order.payment_method || 'COD'}</td>
      </tr>
    `).join('');
  }

  renderProducts(products) {
    const list = document.getElementById('admin-products-list');
    list.innerHTML = products.map(product => `
      <div class="p-4 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center gap-4">
        <img src="${product.image_url || 'https://via.placeholder.com/80'}" alt="${product.name}" class="w-20 h-20 rounded-2xl object-cover" />
        <div>
          <h3 class="font-semibold">${product.name}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">${product.brand || 'Brand'}</p>
          <p class="mt-2 text-blue-600 font-bold">₹${parseFloat(product.price).toFixed(2)}</p>
        </div>
      </div>
    `).join('');
  }

  renderInventory(items) {
    const tbody = document.getElementById('admin-inventory-table');
    tbody.innerHTML = items.map(item => `
      <tr class="border-b border-gray-200 dark:border-gray-700">
        <td class="px-4 py-4">${item.Product?.name || 'Unknown'}</td>
        <td class="px-4 py-4">${item.quantity}</td>
        <td class="px-4 py-4">${item.location}</td>
        <td class="px-4 py-4 text-right">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onclick="window.location.href='/admin-dashboard.html'">Refresh</button>
        </td>
      </tr>
    `).join('');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AdminDashboardPage());
} else {
  new AdminDashboardPage();
}
