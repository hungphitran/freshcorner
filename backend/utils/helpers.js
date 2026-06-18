// Response helper functions
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  res.status(statusCode).json(response);
};

const sendValidationError = (res, errors) => {
  res.status(400).json({
    success: false,
    message: 'Validation errors',
    errors: errors.map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }))
  });
};

const sendNotFound = (res, resource = 'Resource') => {
  res.status(404).json({
    success: false,
    message: `${resource} not found`
  });
};

const sendUnauthorized = (res, message = 'Unauthorized') => {
  res.status(401).json({
    success: false,
    message
  });
};

const sendForbidden = (res, message = 'Forbidden') => {
  res.status(403).json({
    success: false,
    message
  });
};

const sendPaginatedResponse = (res, data, pagination, message = 'Success') => {
  res.json({
    success: true,
    message,
    data,
    pagination
  });
};

// Pagination helper
const getPaginationData = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

// Format currency (Vietnamese Dong)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format date (Vietnamese format)
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

// Format datetime (Vietnamese format)
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('vi-VN');
};

// Generate random string
const generateRandomString = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};

// Generate order number
const generateOrderNumber = () => {
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD${dateString}${random}`;
};

// Sanitize HTML
const sanitizeHtml = (html) => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

// Create slug from string
const createSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim();
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendPaginatedResponse,
  getPaginationData,
  formatCurrency,
  formatDate,
  formatDateTime,
  generateRandomString,
  generateOrderNumber,
  sanitizeHtml,
  createSlug
};
