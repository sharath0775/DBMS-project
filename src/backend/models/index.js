const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const CartItem = require('./CartItem');
const Wishlist = require('./Wishlist');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');
const Inventory = require('./Inventory');
const Payment = require('./Payment');

// Define relationships

// User relationships
User.hasMany(CartItem, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Wishlist, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Review, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Product relationships
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'RESTRICT' });
Product.belongsTo(Category, { foreignKey: 'category_id' });
Product.hasMany(CartItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasMany(Wishlist, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'RESTRICT' });
Product.hasMany(Review, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasOne(Inventory, { foreignKey: 'product_id', onDelete: 'CASCADE' });

// CartItem relationships
CartItem.belongsTo(User, { foreignKey: 'user_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

// Wishlist relationships
Wishlist.belongsTo(User, { foreignKey: 'user_id' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id' });

// Order relationships
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Order.hasOne(Payment, { foreignKey: 'order_id', onDelete: 'CASCADE' });

// OrderItem relationships
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Review relationships
Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Product, { foreignKey: 'product_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });
Inventory.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  User,
  Product,
  Category,
  CartItem,
  Wishlist,
  Order,
  OrderItem,
  Review,
  Inventory,
  Payment,
  sequelize: require('../../../config/database')
};
