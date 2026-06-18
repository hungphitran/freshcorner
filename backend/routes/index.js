const express = require('express');
const router = express.Router();

// Import route modules
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const blogRoutes = require('./blog.routes');
const adminRoutes = require('./admin.routes');
const contactRoutes = require('./contact.routes');
const statisticsRoutes = require('./statistics.routes');
const settingsRoutes = require('./settings.routes');
const categoryRoutes = require('./brand.routes');

// API routes
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/blogs', blogRoutes);
router.use('/admin', adminRoutes);
router.use('/contacts', contactRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/settings', settingsRoutes);
router.use('/categories', categoryRoutes);
// Temporary alias for frontend/admin code migrated in phases.
router.use('/brands', categoryRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: ' API is running',
    timestamp: new Date().toISOString()
  });
});

// API documentation route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      blogs: '/api/blogs',
      admin: '/api/admin',
      contacts: '/api/contacts',
      statistics: '/api/statistics',
      settings: '/api/settings',
      categories: '/api/categories',
      brands: '/api/brands (temporary alias)'
    }
  });
});

module.exports = router;
