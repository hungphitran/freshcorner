const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controller/admin.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Validation rules
const loginValidation = [
  body('username').notEmpty().withMessage('Username or email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const createAdminValidation = [
  body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const updateAdminValidation = [
  body('username').optional().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required')
];

const updateProfileValidation = [
  body('email').optional().isEmail().withMessage('Valid email is required')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Public routes
router.post('/login', loginValidation, adminController.loginAdmin);

// Protected routes
router.get('/profile', authMiddleware, adminController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, adminController.updateProfile);
router.put('/change-password', authMiddleware, changePasswordValidation, adminController.changePassword);

// Super admin routes
router.get('/', authMiddleware, adminController.getAdmins);
router.post('/', authMiddleware, createAdminValidation, adminController.createAdmin);
router.put('/:id', authMiddleware, updateAdminValidation, adminController.updateAdmin);
router.delete('/:id', authMiddleware, adminController.deleteAdmin);

module.exports = router;
