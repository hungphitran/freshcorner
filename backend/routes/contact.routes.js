const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controller/contact.controller');

// Validation rules for contact form
const createContactValidation = [
  body('name').notEmpty().withMessage('Tên là bắt buộc').trim(),
  body('phone').notEmpty().withMessage('Số điện thoại là bắt buộc').trim(),
  // Optional fields - không bắt buộc
  body('subject').optional().trim(),
  body('message').optional().trim()
];

// Public route - Send contact email
router.post('/', createContactValidation, contactController.createContact);

module.exports = router;
