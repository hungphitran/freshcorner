const Product = require('../models/product.model');

// Validate customer info middleware
const validateCustomerInfo = (req, res, next) => {
  const { customer } = req.body;
  
  if (!customer) {
    return res.status(400).json({
      success: false,
      message: 'Customer information is required'
    });
  }

  // Required fields (only name and phone are required now)
  const requiredFields = ['name', 'phone'];
  const missingFields = requiredFields.filter(field => !customer[field]?.trim());
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required customer fields: ${missingFields.join(', ')}`
    });
  }

  // Email validation removed - email is completely optional now

  // Validate phone format (basic validation)
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (!phoneRegex.test(customer.phone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format'
    });
  }

  next();
};

// Validate order items middleware
const validateOrderItems = async (req, res, next) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items are required and must be an array with at least one item'
      });
    }

    // Validate each item
    const validatedItems = [];

    for (const item of items) {
      // Check required fields
      if (!item.productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required for each item'
        });
      }

      // Check if product exists
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      // Check if product is available
      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      // Validate quantity
      const quantity = parseInt(item.quantity) || 1;
      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be greater than 0'
        });
      }

      validatedItems.push({
        product: product._id,
        quantity: quantity,
        price: product.price,
        productData: product // Include product data for processing
      });
    }

    // Add validated items to request
    req.validatedItems = validatedItems;
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error validating order items',
      error: error.message
    });
  }
};

module.exports = {
  validateCustomerInfo,
  validateOrderItems
};
