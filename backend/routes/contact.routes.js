const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controller/contact.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Validation rules for contact form
const createContactValidation = [
  body('name').notEmpty().withMessage('Tên là bắt buộc').trim(),
  body('phone').notEmpty().withMessage('Số điện thoại là bắt buộc').trim(),
  // Optional fields - không bắt buộc
  body('subject').optional().trim(),
  body('message').optional().trim()
];

// Public route - Send contact email and save to DB
router.post('/', createContactValidation, contactController.createContact);

// Admin routes (Protected)
router.get('/', authMiddleware, contactController.getContacts);
router.patch('/:id/status', authMiddleware, contactController.updateContactStatus);
router.delete('/:id', authMiddleware, contactController.deleteContact);

module.exports = router;
