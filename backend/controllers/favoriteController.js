const Favorite = require('../models/Favorite');
const jwt = require('jsonwebtoken');

// Add product to favorites
const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId; // From auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const result = await Favorite.addToFavorites(userId, productId);
    
    if (result) {
      res.json({
        success: true,
        message: 'Product added to favorites'
      });
    } else {
      res.json({
        success: true,
        message: 'Product is already in favorites'
      });
    }
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to favorites',
      error: error.message
    });
  }
};

// Remove product from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const removed = await Favorite.removeFromFavorites(userId, productId);
    
    if (removed) {
      res.json({
        success: true,
        message: 'Product removed from favorites'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found in favorites'
      });
    }
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from favorites',
      error: error.message
    });
  }
};

// Get user's favorite products
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const favorites = await Favorite.getUserFavorites(userId);
    
    res.json({
      success: true,
      message: 'Favorites retrieved successfully',
      data: favorites
    });
  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get favorites',
      error: error.message
    });
  }
};

// Check if product is favorited by user
const checkIfFavorited = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const isFavorited = await Favorite.isFavorited(userId, productId);
    
    res.json({
      success: true,
      data: { isFavorited }
    });
  } catch (error) {
    console.error('Check if favorited error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check favorite status',
      error: error.message
    });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkIfFavorited
}; 