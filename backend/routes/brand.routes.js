const express = require('express');
const router = express.Router();
const categoryController = require('../controller/brand.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Validation rules
const brandValidation = [
    body('name')
        .notEmpty()
        .withMessage('Tên danh mục không được để trống')
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên danh mục phải từ 2-100 ký tự'),
    body('slug')
        .optional()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Slug danh mục không hợp lệ'),
    body('themeKey')
        .optional()
        .isIn(['fruit', 'teabreak', 'snacks', 'smoothies', 'default'])
        .withMessage('Theme danh mục không hợp lệ'),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Mô tả danh mục không được quá 500 ký tự'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('Trạng thái phải là boolean')
];

// Public routes
router.get('/', categoryController.getAllBrands);
router.get('/:id', categoryController.getBrandById);
router.get('/:id/car-models', categoryController.getCarModelsByBrand);

// Protected routes (require admin authentication)
router.post('/', authMiddleware, ...brandValidation, categoryController.createBrand);
router.put('/:id', authMiddleware, ...brandValidation, categoryController.updateBrand);
router.delete('/:id', authMiddleware, categoryController.deleteBrand);

// Deprecated vehicle-fitment routes retained as migration aliases.
router.post('/:brandId/car-models', authMiddleware, categoryController.addCarModel);
router.put('/:brandId/car-models/:carModelId', authMiddleware, categoryController.updateCarModel);
router.delete('/:brandId/car-models/:carModelId', authMiddleware, categoryController.deleteCarModel);

module.exports = router;
