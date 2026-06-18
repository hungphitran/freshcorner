const Category = require('../models/brand.model');
const { validationResult } = require('express-validator');

const toSlug = (value = '') => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const VALID_THEME_KEYS = ['fruit', 'teabreak', 'snacks', 'smoothies', 'default'];
const resolveThemeKey = (value) => VALID_THEME_KEYS.includes(value) ? value : 'default';

const categoryController = {
    getAllBrands: async (req, res) => {
        try {
            const { 
                page = 1, 
                limit = 100, 
                search = '', 
                isActive,
                sortBy = 'name',
                sortOrder = 'asc'
            } = req.query;

            const query = {};
            
            // Filter theo trạng thái
            if (isActive !== undefined) {
                query.isActive = isActive === 'true';
            }

            // Filter theo search
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } }
                ];
            }

            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

            const skip = (parseInt(page) - 1) * parseInt(limit);

            const categories = await Category.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Category.countDocuments(query);
            const totalPages = Math.ceil(total / parseInt(limit));

            res.json({
                success: true,
                data: categories,
                categories,
                pagination: {
                    current: parseInt(page),
                    pages: totalPages,
                    total,
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách danh mục',
                error: error.message
            });
        }
    },

    getBrandById: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy danh mục'
                });
            }

            res.json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin danh mục',
                error: error.message
            });
        }
    },

    createBrand: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không hợp lệ',
                    errors: errors.array()
                });
            }

            const categoryData = {
                ...req.body,
                slug: req.body.slug || toSlug(req.body.name),
                themeKey: resolveThemeKey(req.body.themeKey || req.body.slug || toSlug(req.body.name))
            };
            
            const existingCategory = await Category.findOne({
                $or: [{ name: categoryData.name }, { slug: categoryData.slug }]
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Danh mục đã tồn tại'
                });
            }

            const category = new Category(categoryData);
            await category.save();

            res.status(201).json({
                success: true,
                message: 'Tạo danh mục thành công',
                data: category
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo danh mục',
                error: error.message
            });
        }
    },

    updateBrand: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không hợp lệ',
                    errors: errors.array()
                });
            }

            const category = await Category.findById(req.params.id);
            
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy danh mục'
                });
            }

            const nextSlug = req.body.slug || (req.body.name ? toSlug(req.body.name) : category.slug);
            const existingCategory = await Category.findOne({
                _id: { $ne: req.params.id },
                $or: [{ name: req.body.name }, { slug: nextSlug }]
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên hoặc slug danh mục đã tồn tại'
                });
            }

            Object.assign(category, {
                ...req.body,
                slug: nextSlug,
                themeKey: resolveThemeKey(req.body.themeKey || category.themeKey || nextSlug)
            });
            await category.save();

            res.json({
                success: true,
                message: 'Cập nhật danh mục thành công',
                data: category
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật danh mục',
                error: error.message
            });
        }
    },

    deleteBrand: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy danh mục'
                });
            }

            const Product = require('../models/product.model');
            const productCount = await Product.countDocuments({ category: req.params.id });
            if (productCount > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Không thể xóa danh mục vì có ${productCount} sản phẩm đang sử dụng`
                });
            }

            await Category.findByIdAndDelete(req.params.id);

            res.json({
                success: true,
                message: 'Xóa danh mục thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa danh mục',
                error: error.message
            });
        }
    },

    addCarModel: async (req, res) => {
        res.status(410).json({ success: false, message: 'Dòng xe đã được thay bằng danh mục sản phẩm' });
    },

    updateCarModel: async (req, res) => {
        res.status(410).json({ success: false, message: 'Dòng xe đã được thay bằng danh mục sản phẩm' });
    },

    deleteCarModel: async (req, res) => {
        res.status(410).json({ success: false, message: 'Dòng xe đã được thay bằng danh mục sản phẩm' });
    },

    getCarModelsByBrand: async (req, res) => {
        res.status(410).json({ success: false, message: 'Dòng xe đã được thay bằng danh mục sản phẩm' });
    }
};

module.exports = categoryController;
