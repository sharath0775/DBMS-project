const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('../../config/database');
const env = require('../../config/environment');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

if (env.isProduction) {
  app.use(express.static(path.join(__dirname, '../../dist/frontend')));
}

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Import routes
const routes = require('./routes');

// Routes
app.use('/', routes);

// SPA fallback in production
if (env.isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/frontend/index.html'));
  });
}

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
