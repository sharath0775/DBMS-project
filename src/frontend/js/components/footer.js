// Footer Component
class Footer {
  constructor() {
    this.footer = document.getElementById('footer');
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.footer.innerHTML = `
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- About -->
          <div>
            <h3 class="text-lg font-bold mb-4">NovaCart</h3>
            <p class="text-gray-400">Premium online shopping platform with a wide range of products and competitive prices.</p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-bold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="/" class="hover:text-white transition">Home</a></li>
              <li><a href="/products.html" class="hover:text-white transition">Products</a></li>
              <li><a href="/contact.html" class="hover:text-white transition">Contact</a></li>
              <li><a href="/about.html" class="hover:text-white transition">About Us</a></li>
            </ul>
          </div>

          <!-- Policy -->
          <div>
            <h3 class="text-lg font-bold mb-4">Policy</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition">Terms & Conditions</a></li>
              <li><a href="#" class="hover:text-white transition">Shipping Policy</a></li>
              <li><a href="#" class="hover:text-white transition">Return Policy</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-lg font-bold mb-4">Contact Us</h3>
            <p class="text-gray-400 mb-2">📧 support@novacart.com</p>
            <p class="text-gray-400 mb-4">📱 +91 1234567890</p>
            <div class="flex gap-4">
              <a href="#" class="hover:text-blue-400 transition">f</a>
              <a href="#" class="hover:text-blue-400 transition">𝕏</a>
              <a href="#" class="hover:text-pink-400 transition">📷</a>
              <a href="#" class="hover:text-red-400 transition">▶</a>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 NovaCart. All rights reserved. | Designed & Developed with ❤️</p>
        </div>
      </div>
    `;
  }
}

// Initialize footer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Footer());
} else {
  new Footer();
}
