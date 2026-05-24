const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  order_number: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  discount_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  shipping_cost: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  coupon_code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ordered', 'packed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'ordered'
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  delivery_city: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  delivery_state: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  delivery_pincode: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  delivery_option: {
    type: DataTypes.ENUM('standard', 'express', 'next-day'),
    defaultValue: 'standard'
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tracking_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'orders',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['order_number'] },
    { fields: ['status'] },
    { fields: ['created_at'] }
  ]
});

module.exports = Order;
