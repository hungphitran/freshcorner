const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const blogController = require('../controller/blog.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { uploadSingle, handleUploadError } = require('../middleware/upload.middleware');

// Validation rules
const createBlogValidation = [
  body('title').notEmpty().withMessage('Blog title is required'),
  body('content').notEmpty().withMessage('Blog content is required'),
  body('excerpt').isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters'),
  body('author').notEmpty().withMessage('Author is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('featuredImage').notEmpty().withMessage('Featured image is required')
];

const updateBlogValidation = [
  body('title').optional().notEmpty().withMessage('Blog title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Blog content cannot be empty'),
  body('excerpt').optional().isLength({ max: 500 }).withMessage('Excerpt must be less than 500 characters'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty')
];

// Public routes
router.get('/', blogController.getBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/categories', blogController.getBlogCategories);
router.get('/tags', blogController.getBlogTags);
router.get('/recent', blogController.getRecentBlogs);
router.get('/:slug', blogController.getBlogBySlug);

// Admin routes
router.get('/admin/all', authMiddleware, blogController.getBlogsAdmin);
router.get('/admin/:id', authMiddleware, blogController.getBlogById);
router.post('/', authMiddleware, uploadSingle, handleUploadError, createBlogValidation, blogController.createBlog);
router.put('/:id', authMiddleware, uploadSingle, handleUploadError, updateBlogValidation, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;
