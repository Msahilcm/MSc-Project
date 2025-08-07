const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticateToken } = require('../middleware/auth');

// Add product to favorites
router.post('/:productId', authenticateToken, favoriteController.addToFavorites);

// Remove product from favorites
router.delete('/:productId', authenticateToken, favoriteController.removeFromFavorites);

// Get user's favorite products
router.get('/', authenticateToken, favoriteController.getUserFavorites);

// Check if product is favorited by user
router.get('/:productId/check', authenticateToken, favoriteController.checkIfFavorited);

module.exports = router; 