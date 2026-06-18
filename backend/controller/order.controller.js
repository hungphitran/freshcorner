const Order = require('../models/order.model');
const Product = require('../models/product.model');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const { orderCustomerTemplate, orderAdminTemplate } = require('../utils/emailTemplates');

// Helper function to validate email
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const BRAND_NAME = "Fresh Corner";


// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create order from product list (new way to create orders)
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const validatedItems = req.validatedItems;
    
    if (!validatedItems || validatedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid items provided for the order'
      });
    }

    // Create order from provided items
    const orderData = {
      customer: req.body.customer,
      items: validatedItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      notes: req.body.notes,
      paymentMethod: req.body.paymentMethod || 'cash'
    };

    const order = new Order(orderData);
    
    // Ensure orderNumber is generated before saving
    if (!order.orderNumber) {
      const date = new Date();
      const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      order.orderNumber = `ORD-${dateString}-${random}`;
    }
    
    console.log('Creating order with data:', {
      orderNumber: order.orderNumber,
      customerEmail: req.body.customer.email,
      itemsCount: order.items.length
    });
    
    await order.save();
    console.log('Order saved successfully:', order.orderNumber);

    // Populate product details for email
    await order.populate({
      path: 'items.product',
      select: 'name category packageSize price images code',
      populate: {
        path: 'category',
        select: 'name slug themeKey'
      }
    });

    // Send email notification
    try {
      await sendOrderNotification(order);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully. We will contact you soon.',
      data: {
        orderNumber: order.orderNumber,
        order: order
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Order validation failed',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Order number already exists. Please try again.',
        error: 'Duplicate order number'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Send order notification email
const sendOrderNotification = async (order) => {
  const customerEmail = {
    from: process.env.EMAIL_USER,
    to: order.customer.email,
    subject: `${BRAND_NAME} | Xác nhận liên hệ đơn hàng`,
    html: orderCustomerTemplate(order)
  };

  // Admin notification email
  const adminEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `${BRAND_NAME} | Đơn hàng mới từ khách hàng ${order.customer.name}`,
    html: orderAdminTemplate(order)
  };

  // Send emails - always send admin email, only send customer email if email is valid
  const emailPromises = [transporter.sendMail(adminEmail)];
  
  // Only send customer email if email is valid
  if (isValidEmail(order.customer.email)) {
    emailPromises.push(transporter.sendMail(customerEmail));
  } else {
    console.log('Skipping customer email - invalid or missing email:', order.customer.email);
  }
  
  await Promise.all(emailPromises);
};

// Get order by order number (for customer)
const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate({
        path: 'items.product',
        select: 'name category packageSize images code price',
        populate: {
          path: 'category',
          select: 'name slug themeKey'
        }
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Admin Controllers

// Get all orders
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {};
    
    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.orderDate = {};
      if (req.query.startDate) {
        filter.orderDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.orderDate.$lte = new Date(req.query.endDate);
      }
    }

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { 'customer.name': { $regex: req.query.search, $options: 'i' } },
        { 'customer.email': { $regex: req.query.search, $options: 'i' } },
        { 'customer.phone': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .populate({
        path: 'items.product',
        select: 'name category packageSize code',
        populate: {
          path: 'category',
          select: 'name slug themeKey'
        }
      })
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items.product',
        select: 'name category packageSize storageInstruction shelfLife images code price',
        populate: {
          path: 'category',
          select: 'name slug themeKey'
        }
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrderByNumber,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
