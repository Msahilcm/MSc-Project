const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const controller = require('../controllers/addressController');

const router = express.Router();

const addressValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('line1').notEmpty().withMessage('Address line 1 is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('postalCode').notEmpty().withMessage('Postal code is required'),
  body('country').notEmpty().withMessage('Country is required')
];

router.use(authenticateToken);

router.get('/', controller.listAddresses);
router.post('/', addressValidation, controller.createAddress);
router.put('/:id', controller.updateAddress);
router.delete('/:id', controller.deleteAddress);

module.exports = router;

