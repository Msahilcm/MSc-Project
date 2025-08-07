const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const pool = require('../config/database').pool;

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// Register user
const register = async (req, res) => {
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

    const { email, password, name, surname, phone_prefix = '+44', telephone } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      surname,
      phone_prefix,
      telephone
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          phone_prefix: user.phone_prefix,
          telephone: user.telephone,
          profile_image: user.profile_image
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
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

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          phone_prefix: user.phone_prefix,
          telephone: user.telephone,
          profile_image: user.profile_image,
          isAdmin: user.isAdmin
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // Set by auth middleware
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updateData = req.body;

    const updated = await User.update(userId, updateData);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get updated user data
    const user = await User.findById(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    console.log('Delete account attempt - userId:', req.userId);
    const userId = req.userId;
    
    if (!userId) {
      console.log('No userId found in request');
      return res.status(400).json({
        success: false,
        message: 'User ID not found'
      });
    }
    
    console.log('Attempting to delete user with ID:', userId);
    const deleted = await User.delete(userId);
    
    if (!deleted) {
      console.log('User not found for deletion, ID:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('User deleted successfully, ID:', userId);
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
};

// Change user password
const changePassword = async (req, res) => {
  try {
    console.log('Change password attempt - userId:', req.userId);
    const userId = req.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    
    console.log('Password change request body:', { 
      oldPassword: oldPassword ? 'provided' : 'missing',
      newPassword: newPassword ? 'provided' : 'missing',
      confirmPassword: confirmPassword ? 'provided' : 'missing'
    });
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      console.log('Missing password fields');
      return res.status(400).json({ success: false, message: 'All password fields are required.' });
    }
    if (newPassword !== confirmPassword) {
      console.log('New passwords do not match');
      return res.status(400).json({ success: false, message: 'New passwords do not match.' });
    }
    // Password validation (same as registration)
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(newPassword)) {
      console.log('Password validation failed');
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters and contain uppercase, lowercase, and a number.' });
    }
    // Get user
    console.log('Fetching user with ID:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for password change, ID:', userId);
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    console.log('User found, checking old password');
    console.log('User data:', { id: user.id, email: user.email, hasPassword: !!user.password });
    // Check old password
    const isMatch = await User.verifyPassword(oldPassword, user.password);
    if (!isMatch) {
      console.log('Old password verification failed');
      return res.status(401).json({ success: false, message: 'Old password is incorrect.' });
    }
    console.log('Old password verified, updating to new password');
    // Update password
    await User.updatePassword(userId, newPassword);
    console.log('Password updated successfully for user ID:', userId);
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to change password.', error: error.message });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    console.log('Upload attempt by userId:', req.userId);
    console.log('File info:', req.file);
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ success: false, message: 'No image uploaded.' });
    }
    const userId = req.userId;
    const imagePath = req.file.filename;
    await User.updateProfileImage(userId, imagePath);
    console.log('Image uploaded and DB updated:', imagePath);
    res.json({ success: true, imageUrl: `/uploads/${imagePath}` });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image.', error: error.message });
  }
};

// Debug endpoint to check user data
const debugUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0,
        passwordStartsWith: user.password ? user.password.substring(0, 10) + '...' : 'null'
      }
    });
  } catch (error) {
    console.error('Debug user error:', error);
    res.status(500).json({ success: false, message: 'Debug failed.', error: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Get all users (excluding password field for security)
    const [users] = await pool.execute(`
      SELECT id, email, name, surname, phone_prefix, telephone, profile_image, isAdmin, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

// Delete any user by admin (admin only)
const deleteUserByAdmin = async (req, res) => {
  try {
    const adminUser = await User.findById(req.userId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const userId = req.params.id;
    if (parseInt(userId) === req.userId) {
      return res.status(400).json({ success: false, message: 'Admin cannot delete themselves' });
    }
    const deleted = await User.delete(userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found or already deleted' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // In a real implementation, you would:
    // 1. Store the reset token in the database with an expiration
    // 2. Send an email with the reset link
    // 3. Create a reset password page

    console.log(`Password reset requested for ${email}. Reset token: ${resetToken}`);

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  changePassword,
  uploadProfileImage,
  debugUser,
  getAllUsers,
  deleteUserByAdmin,
  forgotPassword
}; 