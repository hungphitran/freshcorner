const express = require('express');
const router = express.Router();
const settingsController = require('../controller/settings.controller');
const { body } = require('express-validator');

// Validation middleware
const validateSettings = [
  body('storeName').notEmpty().withMessage('Tên cửa hàng là bắt buộc'),
  body('address').notEmpty().withMessage('Địa chỉ là bắt buộc'),
  body('phone').notEmpty().withMessage('Số điện thoại là bắt buộc'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
];

// GET /api/settings - Lấy thông tin cài đặt
router.get('/', settingsController.getSettings);

// PUT /api/settings - Cập nhật thông tin cài đặt
router.put('/', validateSettings, settingsController.updateSettings);

module.exports = router;
