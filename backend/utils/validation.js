const { body, validationResult } = require('express-validator');

// Common validation rules
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  next();
};

const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  if (page < 1) {
    return res.status(400).json({
      success: false,
      message: 'Page number must be greater than 0'
    });
  }
  
  if (limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Limit must be between 1 and 100'
    });
  }
  
  req.pagination = { page, limit };
  next();
};

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Common validation chains
const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

const optionalEmailValidation = body('email')
  .optional()
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');

const phoneValidation = body('phone')
  .matches(/^[\d\s\-\+\(\)]{10,}$/)
  .withMessage('Please provide a valid phone number');

const nameValidation = body('name')
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('Name must be between 2 and 100 characters');

const requiredString = (field) => body(field)
  .trim()
  .notEmpty()
  .withMessage(`${field} is required`);

const optionalString = (field, maxLength = 500) => body(field)
  .optional()
  .trim()
  .isLength({ max: maxLength })
  .withMessage(`${field} must be less than ${maxLength} characters`);

const positiveNumber = (field) => body(field)
  .isFloat({ min: 0 })
  .withMessage(`${field} must be a positive number`);

const positiveInteger = (field) => body(field)
  .isInt({ min: 1 })
  .withMessage(`${field} must be a positive integer`);

const arrayValidation = (field, minLength = 1) => body(field)
  .isArray({ min: minLength })
  .withMessage(`${field} must be an array with at least ${minLength} item(s)`);

const urlValidation = (field) => body(field)
  .isURL()
  .withMessage(`${field} must be a valid URL`);

const dateValidation = (field) => body(field)
  .isISO8601()
  .toDate()
  .withMessage(`${field} must be a valid date`);

const enumValidation = (field, values) => body(field)
  .isIn(values)
  .withMessage(`${field} must be one of: ${values.join(', ')}`);

module.exports = {
  validateId,
  validatePagination,
  handleValidationErrors,
  emailValidation,
  optionalEmailValidation,
  passwordValidation,
  phoneValidation,
  nameValidation,
  requiredString,
  optionalString,
  positiveNumber,
  positiveInteger,
  arrayValidation,
  urlValidation,
  dateValidation,
  enumValidation
};
