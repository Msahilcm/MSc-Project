const { validationResult } = require('express-validator');
const Address = require('../models/Address');

const listAddresses = async (req, res) => {
  try {
    const addresses = await Address.findByUser(req.userId);
    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load addresses' });
  }
};

const createAddress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const result = await Address.create(req.userId, req.body);
    res.status(201).json({ success: true, message: 'Address added', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add address' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await Address.update(req.userId, id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Address not found or no changes' });
    res.json({ success: true, message: 'Address updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update address' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const removed = await Address.remove(req.userId, id);
    if (!removed) return res.status(404).json({ success: false, message: 'Address not found' });
    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete address' });
  }
};

module.exports = { listAddresses, createAddress, updateAddress, deleteAddress };

