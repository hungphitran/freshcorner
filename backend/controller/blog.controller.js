const Blog = require('../models/blog.model');
const { validationResult } = require('express-validator');

// Get all published blogs with pagination
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };

    // Category filter
    if (req.query.category) {
      filter.category = { $regex: req.query.category, $options: 'i' };
    }

    // Search filter
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Tag filter
    if (req.query.tag) {
      filter.tags = { $in: [req.query.tag] };
    }

    const blogs = await Blog.find(filter)
      .select('title slug featuredImage author category tags publishDate featured')
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(filter);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalBlogs / limit),
          totalBlogs,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

// Get single blog by slug
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      status: 'published'
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
};

// Get featured blogs
const getFeaturedBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const blogs = await Blog.find({
      featured: true,
      status: 'published'
    })
    .select('title slug excerpt featuredImage author publishDate')
    .sort({ publishDate: -1 })
    .limit(limit);

    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured blogs',
      error: error.message
    });
  }
};

// Get blog categories
const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    
    res.json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog categories',
      error: error.message
    });
  }
};

// Get blog tags
const getBlogTags = async (req, res) => {
  try {
    const tags = await Blog.distinct('tags', { status: 'published' });
    
    res.json({
      success: true,
      data: tags.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog tags',
      error: error.message
    });
  }
};

// Get recent blogs
const getRecentBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const blogs = await Blog.find({ status: 'published' })
      .select('title slug featuredImage publishDate')
      .sort({ publishDate: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent blogs',
      error: error.message
    });
  }
};

// Admin Controllers

// Get all blogs for admin
const getBlogsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    
    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Category filter
    if (req.query.category) {
      filter.category = { $regex: req.query.category, $options: 'i' };
    }

    // Search filter
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const blogs = await Blog.find(filter)
      .select('title slug excerpt author category status publishDate featured createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(filter);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalBlogs / limit),
          totalBlogs,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

// Get single blog by ID for admin
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
};

// Create new blog
const createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const blog = new Blog(req.body);
    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  getBlogCategories,
  getBlogTags,
  getRecentBlogs,
  getBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
