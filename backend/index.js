require('dotenv').config();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import configurations and utilities
const connectDatabase = require('./config/database');
const { createUploadsDirectory } = require('./utils/createDirectories');
const { createTempUploadDirectory } = require('./utils/createTempDirectory');
const { createDefaultAdmin } = require('./utils/createDefaultAdmin');

// Import routes and middleware
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// Initialize uploads directory
createUploadsDirectory();
createTempUploadDirectory();

// Connect to database
connectDatabase();

// Create default admin after database connection
setTimeout(createDefaultAdmin, 2000);

// CORS configuration
// Check if CORS_ORIGIN is set to wildcard
const corsOrigin = process.env.CORS_ORIGIN;

if (corsOrigin === '*') {
  // Allow all origins
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
} else {
  // Use specific allowed origins for better security
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    corsOrigin
  ].filter(Boolean);

  // Middleware
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list or matches pattern
      if (allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Fresh Corner API',
    version: '1.0.0',
    documentation: '/api'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
});