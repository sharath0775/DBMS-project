const sequelize = require('../config/database');
const { Category, Product, User, Inventory, Review, Order, OrderItem, CartItem, Wishlist, Payment } = require('../src/backend/models');
const { getExactProductImage } = require('../src/backend/utils/imageHelper');

const CATEGORIES = [
  { name: 'Electronics', description: 'Electronic devices and gadgets', icon: '📱' },
  { name: 'Fashion', description: 'Clothing, shoes, and accessories', icon: '👕' },
  { name: 'Home & Kitchen', description: 'Home appliances and kitchen items', icon: '🏠' },
  { name: 'Books', description: 'Books and reading materials', icon: '📚' },
  { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear', icon: '⚽' },
  { name: 'Beauty & Personal Care', description: 'Beauty and personal care products', icon: '💄' },
  { name: 'Toys', description: 'Kids toys and games', icon: '🧸' },
  { name: 'Health', description: 'Wellness and healthcare essentials', icon: '💊' }
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', "Levi's", 'Ikea', 'Philips', 'JBL', 'Amazon', 'Google', 'Dell', 'HP', 'Asus', 'Puma', 'Reebok', 'H&M', 'Uniqlo', 'KitchenAid', 'Bosch'];
const NAMES = ['Ultra', 'Pro', 'Max', 'Air', 'Prime', 'Fusion', 'Glow', 'Edge', 'Flex', 'Core', 'Pulse', 'Nova', 'Spark', 'Shift', 'Vista'];
const TYPES = ['Headphones', 'Watch', 'Blender', 'Sneakers', 'Backpack', 'Jacket', 'Laptop', 'Speaker', 'Camera', 'Lamp', 'Smartphone', 'Gaming Console', 'Tablet', 'Yoga Mat', 'Sunglasses'];

const BRAND_TYPES = {
  'Apple': ['Laptop', 'Smartphone', 'Watch', 'Tablet', 'Headphones'],
  'Samsung': ['Smartphone', 'Laptop', 'Tablet', 'Watch', 'Headphones', 'Speaker'],
  'Sony': ['Headphones', 'Speaker', 'Camera', 'Gaming Console', 'Laptop'],
  'Nike': ['Sneakers', 'Jacket', 'Backpack'],
  'Adidas': ['Sneakers', 'Jacket', 'Backpack'],
  "Levi's": ['Jacket', 'Sneakers', 'Backpack', 'Sunglasses'],
  'Ikea': ['Lamp', 'Blender', 'Backpack'],
  'Philips': ['Headphones', 'Blender', 'Lamp', 'Speaker'],
  'JBL': ['Speaker', 'Headphones'],
  'Amazon': ['Tablet', 'Smartphone', 'Speaker', 'Watch', 'Headphones'],
  'Google': ['Smartphone', 'Tablet', 'Laptop', 'Watch'],
  'Dell': ['Laptop', 'Tablet'],
  'HP': ['Laptop', 'Tablet'],
  'Asus': ['Laptop', 'Gaming Console', 'Smartphone'],
  'Puma': ['Sneakers', 'Jacket', 'Backpack'],
  'Reebok': ['Sneakers', 'Jacket', 'Backpack'],
  'H&M': ['Jacket', 'Sunglasses', 'Backpack', 'Sneakers'],
  'Uniqlo': ['Jacket', 'Backpack', 'Sunglasses'],
  'KitchenAid': ['Blender', 'Lamp'],
  'Bosch': ['Blender', 'Lamp', 'Camera']
};

const TYPE_PRICES = {
  'Headphones': { min: 799, max: 29999 },
  'Watch': { min: 1499, max: 49999 },
  'Blender': { min: 899, max: 12999 },
  'Sneakers': { min: 1299, max: 24999 },
  'Backpack': { min: 499, max: 7999 },
  'Jacket': { min: 1499, max: 19999 },
  'Laptop': { min: 24999, max: 159999 },
  'Speaker': { min: 999, max: 29999 },
  'Camera': { min: 12999, max: 99999 },
  'Lamp': { min: 399, max: 4999 },
  'Smartphone': { min: 6999, max: 99999 },
  'Gaming Console': { min: 24999, max: 49999 },
  'Tablet': { min: 9999, max: 69999 },
  'Yoga Mat': { min: 299, max: 2999 },
  'Sunglasses': { min: 499, max: 14999 }
};

const DESCRIPTIONS = [
  'Premium performance with polished design.',
  'Engineered for comfort and long-lasting use.',
  'Powerful features with modern styling.',
  'A best-selling choice for home and office.',
  'Designed to deliver exceptional value.',
  'Trusted by customers for everyday performance.'
];

const ADDRESSES = [
  { address: '12 Green Park Lane', city: 'Bangalore', state: 'Karnataka', pincode: '560001', phone: '9876543210' },
  { address: '56 Ocean View Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '9765432109' },
  { address: '89 Maple Avenue', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '9123456780' },
  { address: '23 Pearl Road', city: 'Hyderabad', state: 'Telangana', pincode: '500001', phone: '9988776655' }
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const createSku = (i) => `SP${String(i).padStart(6, '0')}`;

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('✓ Database tables dropped and recreated.');

    // 1. Create categories
    const categoryRecords = await Promise.all(CATEGORIES.map((data) => Category.create(data)));
    const categoryMap = Object.fromEntries(categoryRecords.map((category) => [category.name, category.id]));
    console.log('✓ Categories seeded.');

    // 2. Generate 100 products
    const products = [];
    for (let i = 1; i <= 100; i += 1) {
      const brand = randomItem(BRANDS);
      const brandProductTypes = BRAND_TYPES[brand] || TYPES;
      const type = randomItem(brandProductTypes);
      const name = `${brand} ${randomItem(NAMES)} ${type}`;
      
      const priceRange = TYPE_PRICES[type] || { min: 999, max: 99999 };
      const price = Number((randomInt(priceRange.min, priceRange.max) + 0.99).toFixed(2));
      const discount = randomInt(5, 35);
      const originalPrice = Number((price / (1 - discount / 100)).toFixed(2));
      const stock = randomInt(5, 300);
      const rating = Number((Math.random() * 1.5 + 3.5).toFixed(1));

      // Resolve the image using the exact helper
      const imageUrl = getExactProductImage(name, brand, '', i);

      // Map type to category
      const TYPE_CATEGORY = {
        'Headphones': 'Electronics', 'Watch': 'Electronics', 'Laptop': 'Electronics',
        'Speaker': 'Electronics', 'Camera': 'Electronics', 'Smartphone': 'Electronics',
        'Gaming Console': 'Electronics', 'Tablet': 'Electronics',
        'Sneakers': 'Fashion', 'Jacket': 'Fashion', 'Backpack': 'Fashion', 'Sunglasses': 'Fashion',
        'Blender': 'Home & Kitchen', 'Lamp': 'Home & Kitchen',
        'Yoga Mat': 'Sports & Outdoors'
      };
      const category = TYPE_CATEGORY[type] || 'Electronics';

      products.push({
        name,
        description: `${name} – ${randomItem(DESCRIPTIONS)}`,
        price,
        original_price: originalPrice,
        discount_percent: discount,
        stock,
        image_url: imageUrl,
        category_id: categoryMap[category],
        brand,
        rating,
        num_reviews: randomInt(5, 150),
        sku: createSku(i)
      });
    }

    // bulkCreate with individualHooks: true to fire beforeCreate hooks if needed
    const createdProducts = await Product.bulkCreate(products, { validate: true, individualHooks: true });
    await Promise.all(createdProducts.map((product) => Inventory.create({ product_id: product.id, quantity: product.stock, location: 'Main Warehouse' })));
    console.log('✓ Products and Inventory seeded.');

    // 3. Create Admin
    const adminPassword = 'Admin@123';
    await User.create({
      email: 'admin@novacart.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
      phone: '9876543210',
      address: '1 Admin Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    });

    // 4. Create 8 customer users
    const customerUsers = [];
    for (let i = 1; i <= 8; i += 1) {
      const address = ADDRESSES[i % ADDRESSES.length];
      const password = 'Customer@123';
      customerUsers.push(User.create({
        email: `customer${i}@novacart.com`,
        password,
        name: `Customer ${i}`,
        role: 'user',
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      }));
    }
    const users = await Promise.all(customerUsers);
    console.log('✓ Users seeded (1 admin, 8 customers).');

    // 5. Create 200 Reviews
    const reviewPromises = [];
    for (let i = 0; i < 200; i += 1) {
      const product = randomItem(createdProducts);
      reviewPromises.push(Review.create({
        user_id: randomItem(users).id,
        product_id: product.id,
        rating: randomInt(3, 5),
        title: `${randomItem(['Great', 'Excellent', 'Good', 'Solid', 'Reliable'])} purchase`,
        comment: `${randomItem(DESCRIPTIONS)} Highly recommended!`,
        verified_purchase: true,
        helpful_count: randomInt(0, 25)
      }));
    }
    await Promise.all(reviewPromises);
    console.log('✓ Reviews seeded.');

    // 6. Create Wishlists
    const wishlistPromises = [];
    users.forEach((user, idx) => {
      const sampleProducts = createdProducts.slice(idx * 10, idx * 10 + 5);
      sampleProducts.forEach((product) => wishlistPromises.push(Wishlist.create({ user_id: user.id, product_id: product.id })));
    });
    await Promise.all(wishlistPromises);
    console.log('✓ Wishlists seeded.');

    // 7. Create Cart Items
    const cartPromises = [];
    users.forEach((user, index) => {
      const product = createdProducts[index * 8];
      if (product) {
        cartPromises.push(CartItem.create({ user_id: user.id, product_id: product.id, quantity: randomInt(1, 3) }));
      }
    });
    await Promise.all(cartPromises);
    console.log('✓ Cart items seeded.');

    // 8. Create 20 Orders, Order Items, and Payments
    for (let i = 0; i < 20; i += 1) {
      const user = randomItem(users);
      const orderProducts = [
        randomItem(createdProducts),
        randomItem(createdProducts)
      ];

      let subtotal = 0;
      const orderItemsData = [];

      for (const product of orderProducts) {
        const quantity = randomInt(1, 2);
        const price = parseFloat(product.price);
        const itemSubtotal = price * quantity;
        subtotal += itemSubtotal;

        orderItemsData.push({
          product_id: product.id,
          product_name: product.name,
          product_image: product.image_url,
          quantity,
          price_at_purchase: price,
          subtotal: itemSubtotal
        });
      }

      const TAX_RATE = 0.18;
      const taxAmount = Number((subtotal * TAX_RATE).toFixed(2));
      const shippingCost = subtotal > 5000 ? 0 : 150;
      const discountAmount = randomItem([0, 100, 250, 500]);
      const totalAmount = Number((subtotal + taxAmount + shippingCost - discountAmount).toFixed(2));

      const order = await Order.create({
        user_id: user.id,
        order_number: `ORD${String(i + 1).padStart(7, '0')}`,
        subtotal,
        tax_amount: taxAmount,
        shipping_cost: shippingCost,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        status: randomItem(['ordered', 'packed', 'shipped', 'delivered', 'cancelled']),
        delivery_address: user.address,
        delivery_city: user.city,
        delivery_state: user.state,
        delivery_pincode: user.pincode,
        phone_number: user.phone,
        payment_method: randomItem(['Card', 'UPI', 'COD']),
        delivery_option: randomItem(['standard', 'express'])
      });

      // Save OrderItems linked to order
      await Promise.all(orderItemsData.map(item => OrderItem.create({ ...item, order_id: order.id })));

      // Save Payment linked to order
      await Payment.create({
        order_id: order.id,
        amount: totalAmount,
        method: order.payment_method,
        status: order.status === 'cancelled' ? 'failed' : 'success',
        transaction_reference: `TXN${String(randomInt(10000000, 99999999))}`,
        payment_details: JSON.stringify({ gateway: 'Razorpay', card: '**** **** **** 4321' })
      });
    }

    console.log('✓ Orders, Order Items, and Payments seeded.');
    console.log('\n★ Database seeded successfully! ★\n');
    process.exit(0);
  } catch (err) {
    console.error('✗ Database seeding failed:', err);
    process.exit(1);
  }
}

seed();