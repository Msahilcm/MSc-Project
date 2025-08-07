const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message
    });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, quantity, totalAmount, shippingAddress } = req.body;
    const userId = req.userId; // From auth middleware

    const order = await Order.create({
      userId,
      productId,
      quantity,
      totalAmount,
      shippingAddress
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled'
      });
    }

    const updated = await Order.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const orders = await Order.findByUserId(userId);

    res.json({
      success: true,
      message: 'User orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user orders',
      error: error.message
    });
  }
};

// Get order statistics (admin only)
const getOrderStatistics = async (req, res) => {
  try {
    const statistics = await Order.getOrderStatistics();
    res.json({
      success: true,
      message: 'Order statistics retrieved successfully',
      data: statistics
    });
  } catch (error) {
    console.error('Get order statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getUserOrders,
  getOrderStatistics
}; 