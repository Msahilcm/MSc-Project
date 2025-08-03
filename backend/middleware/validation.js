const { body } = require('express-validator');

// Validation rules for registration
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('surname')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Surname must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Surname can only contain letters and spaces'),
  
  body('phone_prefix')
    .optional()
    .isLength({ min: 1, max: 10 })
    .withMessage('Phone prefix must be between 1 and 10 characters'),
  
  body('telephone')
    .optional()
    .isLength({ min: 10, max: 20 })
    .withMessage('Telephone number must be between 10 and 20 characters')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Telephone number can only contain numbers, spaces, and special characters')
];

// Validation rules for login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for profile update
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('surname')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Surname must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Surname can only contain letters and spaces'),
  
  body('phone_prefix')
    .optional()
    .isLength({ min: 1, max: 10 })
    .withMessage('Phone prefix must be between 1 and 10 characters'),
  
  body('telephone')
    .optional()
    .isLength({ min: 10, max: 20 })
    .withMessage('Telephone number must be between 10 and 20 characters')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Telephone number can only contain numbers, spaces, and special characters')
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation
}; 