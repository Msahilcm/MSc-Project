const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Handle file uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    }

    const productData = {
      ...req.body,
      images: JSON.stringify(imageUrls),
      colors: req.body.colors || '[]'
    };

    const productId = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: productId }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Update product request for ID:', id);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Get existing product to preserve current images
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      console.log('Product not found with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('Existing product:', existingProduct);

    // Handle file uploads - combine new uploads with existing images
    let imageUrls = [...(existingProduct.images || [])];
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => `/uploads/${file.filename}`);
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    console.log('Final image URLs:', imageUrls);

    const productData = {
      ...req.body,
      images: JSON.stringify(imageUrls),
      colors: req.body.colors || '[]'
    };

    console.log('Product data to update:', productData);

    const updated = await Product.update(id, productData);

    if (!updated) {
      console.log('Product update failed for ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('Product updated successfully');
    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}; 