const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fw_furniture',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        phone_prefix VARCHAR(10) DEFAULT '+44',
        telephone VARCHAR(20),
        profile_image VARCHAR(255),
        isAdmin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        monthly_price DECIMAL(10,2),
        category VARCHAR(100),
        stock INT DEFAULT 0,
        colors JSON,
        images JSON,
        rating DECIMAL(3,2) DEFAULT 0,
        reviews INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Check if admin user exists, if not create one
    const [adminUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['admin@fw.com']
    );

    if (adminUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(`
        INSERT INTO users (email, password, name, surname, isAdmin)
        VALUES (?, ?, ?, ?, ?)
      `, ['admin@fw.com', hashedPassword, 'Admin', 'User', true]);
      console.log('Admin user created: admin@fw.com / admin123');
    }

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

module.exports = { pool, initDatabase }; 