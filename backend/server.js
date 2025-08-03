const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const { initDatabase } = require('./config/database');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'FW Furniture Backend is running!' });
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

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database tables
    await initDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📝 API Documentation:`);
      console.log(`   POST /api/auth/register - Register new user`);
      console.log(`   POST /api/auth/login - Login user`);
      console.log(`   GET /api/auth/profile - Get user profile (protected)`);
      console.log(`   PUT /api/auth/profile - Update user profile (protected)`);
      console.log(`   GET /api/products - Get all products`);
      console.log(`   GET /api/products/:id - Get product by ID`);
      console.log(`   POST /api/products - Create product (admin only)`);
      console.log(`   PUT /api/products/:id - Update product (admin only)`);
      console.log(`   DELETE /api/products/:id - Delete product (admin only)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer(); 