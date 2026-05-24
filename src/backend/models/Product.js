const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const { getExactProductImage } = require('../utils/imageHelper');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [3, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  discount_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  num_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sku: {
    type: DataTypes.STRING(50),
    unique: true,
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
  tableName: 'products',
  timestamps: false,
  hooks: {
    beforeCreate: (product) => {
      if (!product.image_url || product.image_url.includes('placeholder') || product.image_url.includes('picsum.photos')) {
        const seedIndex = Math.floor(Math.random() * 100);
        product.image_url = getExactProductImage(product.name, product.brand, '', seedIndex);
      }
    },
    beforeUpdate: (product) => {
      if (!product.image_url || product.image_url.includes('placeholder') || product.image_url.includes('picsum.photos')) {
        const seedIndex = Math.floor(Math.random() * 100);
        product.image_url = getExactProductImage(product.name, product.brand, '', seedIndex);
      }
    }
  },
  indexes: [
    { fields: ['category_id'] },
    { fields: ['name'] },
    { fields: ['brand'] },
    { fields: ['price'] }
  ]
});

module.exports = Product;
