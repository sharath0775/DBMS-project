const { Sequelize } = require('sequelize');
const path = require('path');
const env = require('./environment');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', env.DATABASE.storage || 'database/novacart.sqlite'),
  logging: false
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('✓ Database connection established successfully'))
  .catch(err => console.error('✗ Unable to connect to the database:', err));

module.exports = sequelize;
