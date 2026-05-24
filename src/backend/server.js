const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('../../config/database');
const env = require('../../config/environment');

const app = express();

// Middleware
app.use(helmet());
const allowedOrigins = [
  env.FRONTEND_URL,
  'https://effulgent-kataifi-556dfa.netlify.app',
  'https://sharathbs.netlify.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed or contains localhost
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.includes('localhost') || 
                      origin.includes('127.0.0.1');
                      
    if (!isAllowed) {
      return callback(new Error('CORS policy does not allow access from origin: ' + origin), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));



// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Import routes
const routes = require('./routes');

// Routes
app.use('/', routes);



// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: env.isDevelopment ? err.message : 'Internal server error',
    ...(env.isDevelopment && { stack: err.stack })
  });
});

// Start server
const PORT = env.PORT || 4000;

sequelize.sync()
  .then(() => {
    console.log("✓ Database connected and synced successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection/sync error:", err);
  });

module.exports = app;
