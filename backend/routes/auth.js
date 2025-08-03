const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { 
  registerValidation, 
  loginValidation, 
  updateProfileValidation 
} = require('../middleware/validation');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'user_' + req.userId + '_' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// Register route
router.post('/register', registerValidation, authController.register);

// Login route (unified for both regular users and admin)
router.post('/login', loginValidation, authController.login);

// Get user profile (protected route)
router.get('/profile', authenticateToken, authController.getProfile);

// Update user profile (protected route)
router.put('/profile', authenticateToken, updateProfileValidation, authController.updateProfile);

// Delete user account (protected route)
router.delete('/profile', authenticateToken, authController.deleteAccount);

// Change password (protected route)
router.put('/password', authenticateToken, authController.changePassword);

// Upload profile image (protected)
router.post('/profile-image', authenticateToken, upload.single('image'), authController.uploadProfileImage);

// Debug user data (protected)
router.get('/debug', authenticateToken, authController.debugUser);

module.exports = router; 