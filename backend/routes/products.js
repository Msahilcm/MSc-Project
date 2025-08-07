const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { body } = require('express-validator');
const upload = require('../middleware/upload');

// Validation rules for creating products
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').notEmpty().withMessage('Product category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Valid stock quantity is required'),
  body('colors').notEmpty().withMessage('Colors is required').custom((value) => {
    try {
      const colors = JSON.parse(value);
      if (!Array.isArray(colors)) {
        throw new Error('Colors must be an array');
      }
      if (colors.length === 0) {
        throw new Error('At least one color is required');
      }
      // Check if colors are objects with name and stock properties
      for (const color of colors) {
        if (!color.name || typeof color.name !== 'string' || color.name.trim() === '') {
          throw new Error('Each color must have a valid name');
        }
        if (typeof color.stock !== 'number' || color.stock < 0) {
          throw new Error('Each color must have a valid stock number');
        }
      }
      return true;
    } catch (error) {
      throw new Error('Invalid colors format');
    }
  })
];

// Validation rules for updating products (more flexible)
const updateProductValidation = [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Product description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').optional().notEmpty().withMessage('Product category cannot be empty'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Valid stock quantity is required'),
  body('colors').optional().custom((value) => {
    if (!value) return true; // Allow empty for updates
    try {
      const colors = JSON.parse(value);
      if (!Array.isArray(colors)) {
        throw new Error('Colors must be an array');
      }
      // Check if colors are objects with name and stock properties
      for (const color of colors) {
        if (!color.name || typeof color.name !== 'string' || color.name.trim() === '') {
          throw new Error('Each color must have a valid name');
        }
        if (typeof color.stock !== 'number' || color.stock < 0) {
          throw new Error('Each color must have a valid stock number');
        }
      }
      return true;
    } catch (error) {
      throw new Error('Invalid colors format');
    }
  })
];

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes (admin only)
router.post('/', authenticateToken, upload.array('images', 5), productValidation, productController.createProduct);
router.put('/:id', authenticateToken, upload.array('images', 5), updateProductValidation, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);

// Product reviews
router.get('/:id/reviews', productController.getProductReviews);
router.post('/:id/reviews', productController.addProductReview);

module.exports = router; 