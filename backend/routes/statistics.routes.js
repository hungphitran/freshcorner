const express = require('express');
const router = express.Router();
const statisticsController = require('../controller/statistics.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Admin routes - all statistics require authentication
router.get('/dashboard', authMiddleware, statisticsController.getDashboardStats);
router.get('/products', authMiddleware, statisticsController.getProductStats);
router.get('/orders', authMiddleware, statisticsController.getOrderStats);
router.get('/contacts', authMiddleware, statisticsController.getContactStats);

module.exports = router;
