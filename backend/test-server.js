const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'FW Furniture Backend is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Test auth route (without database)
app.post('/api/auth/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working! Database connection required for full functionality.',
    data: {
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        surname: 'User'
      },
      token: 'test-token-123'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test Server is running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test auth: http://localhost:${PORT}/api/auth/test`);
  console.log(`📝 Note: This is a test server without database connection`);
}); 