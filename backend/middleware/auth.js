const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ success: false, message: 'Authentication failed: No token provided.' });
  }
  
  console.log('Token extracted:', token.substring(0, 20) + '...' + token.substring(token.length - 20));
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verification error:', err.message);
      console.log('Error name:', err.name);
      if (err.name === 'TokenExpiredError') {
        console.log('Token expired at:', err.expiredAt);
      }
      return res.status(403).json({ success: false, message: 'Authentication failed: Invalid token.' });
    }
    console.log('JWT verification successful, user ID:', user.id);
    req.userId = user.id;
    next();
  });
}

module.exports = {
  authenticateToken
}; 