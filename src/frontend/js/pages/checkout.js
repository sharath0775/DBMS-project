// Checkout Page Logic
class CheckoutPage {
  constructor() {
    this.init();
  }

  init() {
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

    this.loadOrderSummary();
    this.attachListeners();
    this.loadUserData();
  }

  loadOrderSummary() {
    const cart = StorageManager.getCart();
    const { subtotal, tax, total } = Helpers.calculateCartTotal(cart);

    const itemsContainer = document.getElementById('order-items');
    itemsContainer.innerHTML = cart.map(item => `
      <div class="flex justify-between">
        <span class="text-sm">${item.name} x${item.quantity}</span>
        <span class="text-sm">₹${((item.price * item.quantity) / 100).toFixed(2)}</span>
      </div>
    `).join('');

    document.getElementById('checkout-subtotal').textContent = `₹${(subtotal / 100).toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `₹${(tax / 100).toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `₹${(total / 100).toFixed(2)}`;
  }

  loadUserData() {
    const user = StorageManager.getUser();
    if (user) {
      document.getElementById('phone_number').value = user.phone || '';
      document.getElementById('delivery_address').value = user.address || '';
      document.getElementById('delivery_city').value = user.city || '';
      document.getElementById('delivery_state').value = user.state || '';
      document.getElementById('delivery_pincode').value = user.pincode || '';
    }
  }

  attachListeners() {
    document.getElementById('checkout-form').addEventListener('submit', (e) => this.handleSubmit(e));

    // Update shipping cost based on delivery option
    document.querySelectorAll('input[name="delivery_option"]').forEach(radio => {
      radio.addEventListener('change', () => this.updateShippingCost());
    });
  }

  updateShippingCost() {
    const option = document.querySelector('input[name="delivery_option"]:checked').value;
    const cart = StorageManager.getCart();
    const { subtotal, tax } = Helpers.calculateCartTotal(cart);
    let shipping = 0;
    
    if (option === 'express') shipping = 50 * 100;
    if (option === 'next-day') shipping = 100 * 100;

    const total = subtotal + tax + shipping;
    document.getElementById('checkout-shipping').textContent = `${shipping === 0 ? 'Free' : `₹${(shipping / 100).toFixed(2)}`}`;
    document.getElementById('checkout-total').textContent = `₹${(total / 100).toFixed(2)}`;
  }

  async handleSubmit(e) {
    e.preventDefault();

    try {
      const cart = StorageManager.getCart();
      if (cart.length === 0) {
        Helpers.showToast('Your cart is empty', 'error');
        return;
      }

      const deliveryOption = document.querySelector('input[name="delivery_option"]:checked').value;
      const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
      const couponCode = document.getElementById('coupon_code').value || null;

      const orderData = {
        delivery_address: document.getElementById('delivery_address').value,
        delivery_city: document.getElementById('delivery_city').value,
        delivery_state: document.getElementById('delivery_state').value,
        delivery_pincode: document.getElementById('delivery_pincode').value,
        phone_number: document.getElementById('phone_number').value,
        delivery_option: deliveryOption,
        payment_method: paymentMethod,
        coupon_code: couponCode
      };

      const { subtotal, tax } = Helpers.calculateCartTotal(cart);
      let shippingAmount = 0;
      if (deliveryOption === 'express') shippingAmount = 50 * 100;
      if (deliveryOption === 'next-day') shippingAmount = 100 * 100;
      const totalAmount = subtotal + tax + shippingAmount;

      Helpers.showLoader();
      if (paymentMethod !== 'cod') {
        await api.processPayment({
          amount: totalAmount / 100,
          payment_method: paymentMethod,
          payment_details: {
            gateway: paymentMethod === 'card' ? 'Card' : 'UPI',
            order_summary: cart.map(item => ({ name: item.name, quantity: item.quantity }))
          }
        });
      }

      const order = await api.createOrder(orderData);
      Helpers.hideLoader();

      // Clear cart
      StorageManager.clearCart();
      window.dispatchEvent(new Event('cartUpdated'));

      Helpers.showToast('Order placed successfully!', 'success');
      setTimeout(() => {
        window.location.href = `/orders.html`;
      }, 1500);
    } catch (err) {
      Helpers.hideLoader();
      Helpers.showToast(err.message || 'Error placing order', 'error');
    }
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CheckoutPage());
} else {
  new CheckoutPage();
}
