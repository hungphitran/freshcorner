const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const { uploadMultiple, handleUploadError, cleanupTempFiles } = require('../middleware/upload.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const mongoose = require('mongoose');

// Validation middleware
const validateProduct = [
    body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
    body('code').notEmpty().withMessage('Mã sản phẩm là bắt buộc'),
    body('category')
        .optional()
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Category ID không hợp lệ');
            }
            return true;
        }),
    body('brand')
        .optional()
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Category ID không hợp lệ');
            }
            return true;
        }),
    body().custom(value => {
        if (!value.category && !value.brand) {
            throw new Error('Danh mục là bắt buộc');
        }
        return true;
    }),
    body('price').isFloat({ min: 0 }).withMessage('Giá bán phải là số dương'),
    body('description').notEmpty().withMessage('Mô tả là bắt buộc'),
    body('stock').isInt({ min: 0 }).withMessage('Số lượng tồn phải là số nguyên không âm'),
    body('origin').optional().isLength({ max: 100 }).withMessage('Xuất xứ không được quá 100 ký tự'),
    body('ingredients').optional().isLength({ max: 500 }).withMessage('Thành phần không được quá 500 ký tự'),
    body('packageSize').optional().isLength({ max: 100 }).withMessage('Quy cách không được quá 100 ký tự'),
    body('storageInstruction').optional().isLength({ max: 200 }).withMessage('Hướng dẫn bảo quản không được quá 200 ký tự'),
    body('shelfLife').optional().isLength({ max: 100 }).withMessage('Hạn dùng không được quá 100 ký tự')
];

// Routes công khai (không cần xác thực)
router.get('/', productController.getAllProducts);
router.get('/search/:code', productController.searchByCode);
router.get('/brand/:brand', productController.getProductsByBrand);
router.get('/brand/:brandId/car-models', productController.getCompatibleModelsByBrand);
router.get('/car-model/:carModel', productController.getProductsByCarModel);
router.get('/:id', productController.getProductById);

// Routes quản trị (cần xác thực)
router.post('/', 
    authMiddleware, 
    uploadMultiple, 
    cleanupTempFiles,
    validateProduct,
    handleUploadError,
    productController.createProduct
);

router.put('/:id', 
    authMiddleware, 
    uploadMultiple, 
    cleanupTempFiles,
    validateProduct,
    handleUploadError,
    productController.updateProduct
);

router.delete('/:id', 
    authMiddleware, 
    productController.deleteProduct
);

router.patch('/:id/status', 
    authMiddleware, 
    productController.updateProductStatus
);

module.exports = router;
