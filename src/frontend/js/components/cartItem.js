// Cart Item Component
class CartItem {
  static render(item, index) {
    return `
      <div class="flex gap-4 py-4 border-b dark:border-gray-700 last:border-b-0">
        <img src="${item.image_url}" alt="${item.name}" class="w-24 h-24 object-cover rounded">
        <div class="flex-1">
          <h3 class="font-bold text-lg">${item.name}</h3>
          <p class="text-gray-600 dark:text-gray-400">₹${(item.price / 100).toFixed(2)}</p>
          <div class="flex items-center gap-2 mt-2">
            <button class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600" 
                    onclick="window.CartPageInstance.updateQuantity(${index}, ${item.quantity - 1})">-</button>
            <input type="number" value="${item.quantity}" readonly class="w-12 text-center border rounded dark:bg-gray-700">
            <button class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600" 
                    onclick="window.CartPageInstance.updateQuantity(${index}, ${item.quantity + 1})">+</button>
          </div>
        </div>
        <div class="text-right">
          <p class="font-bold text-lg">₹${((item.price * item.quantity) / 100).toFixed(2)}</p>
          <button onclick="window.CartPageInstance.removeFromCart(${index})" class="text-red-600 hover:text-red-700 font-semibold mt-4">Remove</button>
        </div>
      </div>
    `;
  }
}

if (typeof window !== 'undefined') {
  window.CartItem = CartItem;
}
