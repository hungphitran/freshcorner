const Product = require('../models/product.model');
const Order = require('../models/order.model');
const { uploadToCloudinary, uploadMultipleToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 12, search, category, brand, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        // Tạo filter object
        const filter = { isActive: true };
        
        if (search) {
            // Tìm kiếm trong nhiều trường khác nhau
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { origin: { $regex: search, $options: 'i' } },
                { ingredients: { $regex: search, $options: 'i' } },
                { packageSize: { $regex: search, $options: 'i' } },
                { storageInstruction: { $regex: search, $options: 'i' } },
                { shelfLife: { $regex: search, $options: 'i' } }
            ];
        }
        
        const categoryParam = category || brand;
        if (categoryParam) {
            const Category = require('../models/brand.model');
            if (mongoose.Types.ObjectId.isValid(categoryParam)) {
                filter.category = categoryParam;
            } else {
                const categoryDoc = await Category.findOne({
                    $or: [
                        { slug: categoryParam.toLowerCase() },
                        { name: { $regex: categoryParam, $options: 'i' } }
                    ],
                    isActive: true
                });
                if (categoryDoc) {
                    filter.category = categoryDoc._id;
                } else {
                    return res.json({
                        success: true,
                        data: [],
                        pagination: {
                            page: parseInt(page),
                            limit: parseInt(limit),
                            total: 0,
                            pages: 0
                        }
                    });
                }
            }
        }
        
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        
        // Tạo object sort dựa trên tham số sortBy và sortOrder
        const sortOptions = {};
        const validSortFields = ['createdAt', 'updatedAt', 'name', 'price', 'code'];
        const validSortOrders = ['asc', 'desc'];
        
        // Validate sortBy field
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        // Validate sortOrder
        const order = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';
        
        sortOptions[sortField] = order === 'asc' ? 1 : -1;
        
        // Thực hiện query với populate category
        const products = await Product.find(filter)
            .populate('category', 'name slug themeKey isActive')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sortOptions);
        
        const total = await Product.countDocuments(filter);
        
        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: error.message
        });
    }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug themeKey isActive');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        const orderCount = await Order.countDocuments({ 'items.product': product._id });
        if (orderCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Không thể xóa sản phẩm vì đang có ${orderCount} đơn hàng liên quan. Hãy tạm ẩn sản phẩm thay vì xóa.`
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin sản phẩm',
            error: error.message
        });
    }
};

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }
        
        const { name, code, category, brand, price, description, stock, origin, ingredients, packageSize, storageInstruction, shelfLife } = req.body;
        
        const categoryId = category || brand;
        const Category = require('../models/brand.model');
        const categoryDoc = await Category.findById(categoryId);
        if (!categoryDoc || !categoryDoc.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Danh mục không hợp lệ hoặc đã bị vô hiệu hóa'
            });
        }
        
        // Xử lý upload ảnh lên Cloudinary
        let images = [];
        if (req.files && req.files.length > 0) {
            const uploadResults = await uploadMultipleToCloudinary(req.files, 'products');
            images = uploadResults.map(result => ({
                public_id: result.public_id,
                url: result.url,
                width: result.width,
                height: result.height,
                alt: name
            }));
        }
        
        // Tạo sản phẩm mới
        const product = new Product({
            name,
            code,
            category: categoryId,
            price,
            description,
            stock: stock || 0,
            origin: origin || '',
            ingredients: ingredients || '',
            packageSize: packageSize || '',
            storageInstruction: storageInstruction || '',
            shelfLife: shelfLife || '',
            images
        });
        
        await product.save();
        
        await product.populate('category', 'name slug themeKey isActive');
        
        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm thành công',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo sản phẩm',
            error: error.message
        });
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }
        
        const productId = req.params.id;
        const { name, code, category, brand, price, description, stock, origin, ingredients, packageSize, storageInstruction, shelfLife, removeImages } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        
        // Xử lý xóa ảnh cũ nếu có
        if (removeImages && removeImages.length > 0) {
            const imagesToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
            
            for (const publicId of imagesToRemove) {
                await deleteFromCloudinary(publicId);
                product.images = product.images.filter(img => img.public_id !== publicId);
            }
        }
        
        // Xử lý upload ảnh mới
        if (req.files && req.files.length > 0) {
            const uploadResults = await uploadMultipleToCloudinary(req.files, 'products');
            const newImages = uploadResults.map(result => ({
                public_id: result.public_id,
                url: result.url,
                width: result.width,
                height: result.height,
                alt: name || product.name
            }));
            
            product.images = [...product.images, ...newImages];
        }
        
        // Cập nhật thông tin sản phẩm
        if (name) product.name = name;
        if (code) product.code = code;
        const categoryId = category || brand;
        if (categoryId) {
            const Category = require('../models/brand.model');
            const categoryDoc = await Category.findById(categoryId);
            if (!categoryDoc || !categoryDoc.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'Danh mục không hợp lệ hoặc đã bị vô hiệu hóa'
                });
            }
            product.category = categoryId;
        }
        if (price) product.price = price;
        if (description) product.description = description;
        if (stock !== undefined) product.stock = stock;
        if (origin !== undefined) product.origin = origin;
        if (ingredients !== undefined) product.ingredients = ingredients;
        if (packageSize !== undefined) product.packageSize = packageSize;
        if (storageInstruction !== undefined) product.storageInstruction = storageInstruction;
        if (shelfLife !== undefined) product.shelfLife = shelfLife;
        
        await product.save();
        
        await product.populate('category', 'name slug themeKey isActive');
        
        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật sản phẩm',
            error: error.message
        });
    }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        
        // Xóa tất cả ảnh trên Cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                await deleteFromCloudinary(image.public_id);
            }
        }
        
        await Product.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa sản phẩm',
            error: error.message
        });
    }
};

// Tìm kiếm sản phẩm theo mã sản phẩm
const searchByCode = async (req, res) => {
    try {
        const { code } = req.params;
        
        const product = await Product.findOne({ code, isActive: true })
            .populate('category', 'name slug themeKey isActive');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm với mã này'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tìm kiếm sản phẩm',
            error: error.message
        });
    }
};

// Lấy sản phẩm theo danh mục
const getProductsByBrand = async (req, res) => {
    try {
        const { brand } = req.params;
        const { page = 1, limit = 12 } = req.query;
        
        let categoryFilter;
        if (mongoose.Types.ObjectId.isValid(brand)) {
            categoryFilter = brand;
        } else {
            const Category = require('../models/brand.model');
            const categoryDoc = await Category.findOne({
                $or: [
                    { slug: brand.toLowerCase() },
                    { name: { $regex: brand, $options: 'i' } }
                ],
                isActive: true
            });
            if (!categoryDoc) {
                return res.json({
                    success: true,
                    data: [],
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: 0,
                        pages: 0
                    }
                });
            }
            categoryFilter = categoryDoc._id;
        }
        
        const products = await Product.find({ category: categoryFilter, isActive: true })
            .populate('category', 'name slug themeKey isActive')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });
        
        const total = await Product.countDocuments({ category: categoryFilter, isActive: true });
        
        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm theo danh mục',
            error: error.message
        });
    }
};

// Deprecated vehicle endpoint
const getProductsByCarModel = async (req, res) => {
    res.status(410).json({ success: false, message: 'Dòng xe đã được thay bằng danh mục sản phẩm' });
};

// Cập nhật trạng thái sản phẩm
const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        
        const product = await Product.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).populate('category', 'name slug themeKey isActive');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        
        res.json({
            success: true,
            message: 'Cập nhật trạng thái sản phẩm thành công',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái sản phẩm',
            error: error.message
        });
    }
};

// Deprecated helper function
const getCompatibleModelsByBrand = async (req, res) => {
    res.status(410).json({ success: false, message: 'Dòng xe đã được thay bằng danh mục sản phẩm' });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchByCode,
    getProductsByBrand,
    getProductsByCarModel,
    updateProductStatus,
    getCompatibleModelsByBrand
};
