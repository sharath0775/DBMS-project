// Cart Page Logic
class CartPage {
  constructor() {
    this.init();
  }

  init() {
    // Apply theme
    const theme = StorageManager.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    this.renderCart();
    this.attachListeners();
  }

  renderCart() {
    const cart = StorageManager.getCart();
    const container = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');

    if (cart.length === 0) {
      container.innerHTML = '';
      emptyCart.style.display = 'block';
      document.getElementById('cart-summary').style.display = 'none';
      return;
    }

    emptyCart.style.display = 'none';
    document.getElementById('cart-summary').style.display = 'block';

    container.innerHTML = `
      <div class="p-6">
        ${cart.map((item, index) => `
          <div class="flex gap-4 py-4 border-b dark:border-gray-700 last:border-b-0">
            <img src="${item.image_url}" alt="${item.name}" class="w-24 h-24 object-cover rounded">
            <div class="flex-1">
              <h3 class="font-bold text-lg">${item.name}</h3>
              <p class="text-gray-600 dark:text-gray-400">₹${(item.price / 100).toFixed(2)}</p>
              <div class="flex items-center gap-2 mt-2">
                <button onclick="updateQuantity(${index}, ${item.quantity - 1})" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">-</button>
                <input type="number" value="${item.quantity}" readonly class="w-12 text-center border rounded dark:bg-gray-700">
                <button onclick="updateQuantity(${index}, ${item.quantity + 1})" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">+</button>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-lg">₹${((item.price * item.quantity) / 100).toFixed(2)}</p>
              <button onclick="removeFromCart(${index})" class="text-red-600 hover:text-red-700 font-semibold mt-4">Remove</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.updateSummary();
  }

  updateSummary() {
    const cart = StorageManager.getCart();
    const { subtotal, tax, total } = Helpers.calculateCartTotal(cart);

    document.getElementById('subtotal').textContent = `₹${(subtotal / 100).toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${(tax / 100).toFixed(2)}`;
    document.getElementById('total').textContent = `₹${(total / 100).toFixed(2)}`;
  }

  attachListeners() {
    window.updateQuantity = (index, newQuantity) => {
      let cart = StorageManager.getCart();
      if (newQuantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = newQuantity;
      }
      StorageManager.setCart(cart);
      this.renderCart();
      window.dispatchEvent(new Event('cartUpdated'));
    };

    window.removeFromCart = (index) => {
      let cart = StorageManager.getCart();
      cart.splice(index, 1);
      StorageManager.setCart(cart);
      this.renderCart();
      window.dispatchEvent(new Event('cartUpdated'));
      Helpers.showToast('Item removed', 'success');
    };
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CartPage());
} else {
  new CartPage();
}
