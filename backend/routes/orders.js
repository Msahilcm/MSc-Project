const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware for creating orders
const createOrderValidation = [
  body('productId').isInt().withMessage('Product ID must be a valid integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required')
];

// Get all orders (admin only)
router.get('/', authenticateToken, orderController.getAllOrders);

// Get order by ID
router.get('/:id', authenticateToken, orderController.getOrderById);

// Create new order (authenticated users)
router.post('/', authenticateToken, createOrderValidation, orderController.createOrder);

// Update order status (admin only)
router.put('/:id/status', authenticateToken, orderController.updateOrderStatus);

// Get user's orders
router.get('/user/orders', authenticateToken, orderController.getUserOrders);

// Get order statistics (admin only)
router.get('/statistics', authenticateToken, orderController.getOrderStatistics);

module.exports = router; 