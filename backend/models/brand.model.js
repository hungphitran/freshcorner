const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    themeKey: {
        type: String,
        enum: ['fruit', 'teabreak', 'snacks', 'smoothies', 'default'],
        default: 'default'
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index cho tìm kiếm danh mục
brandSchema.index({ name: 'text' });
brandSchema.index({ slug: 1 });
brandSchema.index({ isActive: 1 });

// Middleware update updatedAt
brandSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Category', brandSchema);
