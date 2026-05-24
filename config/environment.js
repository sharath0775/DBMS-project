require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database (SQLite)
  DATABASE: {
    storage: process.env.DB_STORAGE || 'database/novacart.sqlite'
  },

  // JWT
  JWT: {
    secret: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    expiresIn: process.env.JWT_EXPIRE || '7d'
  },

  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Session
  SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT) || 7200000,

  // Logging
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};
