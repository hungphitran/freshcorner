const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: false, // Changed to optional
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: false, // Changed to optional
      trim: true
    },
    city: {
      type: String,
      required: false, // Changed to optional
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    ward: {
      type: String,
      trim: true
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  status: {
    type: String,
    enum: ['contacted', 'not contacted'],
    default: 'not contacted'
  },
  notes: {
    type: String,
    trim: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field for total amount
orderSchema.virtual('totalAmount').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Virtual field for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
    let orderNumber;
    let isUnique = false;
    let attempts = 0;
    
    // Ensure unique order number
    while (!isUnique && attempts < 10) {
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      orderNumber = `ORD-${dateString}-${random}`;
      
      const existingOrder = await this.constructor.findOne({ orderNumber });
      if (!existingOrder) {
        isUnique = true;
      }
      attempts++;
    }
    
    if (isUnique) {
      this.orderNumber = orderNumber;
    } else {
      // Fallback to timestamp-based number if random fails
      this.orderNumber = `ORD-${dateString}-${Date.now().toString().slice(-6)}`;
    }
  }
  
  // Update updatedAt
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
