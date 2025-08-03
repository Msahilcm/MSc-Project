const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

console.log('🚀 FW Furniture Backend Setup');
console.log('==============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  try {
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envExample);
    console.log('✅ .env file created successfully!');
    console.log('⚠️  Please edit .env file with your database credentials before running the server.');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }
} else {
  console.log('✅ .env file already exists');
}

// Database setup instructions
console.log('\n📋 Database Setup Instructions:');
console.log('1. Make sure MySQL is running on your system');
console.log('2. Create a database named "fw_furniture":');
console.log('   CREATE DATABASE fw_furniture;');
console.log('3. Update the .env file with your MySQL credentials:');
console.log('   DB_HOST=localhost');
console.log('   DB_USER=root');
console.log('   DB_PASSWORD=your_mysql_password');
console.log('   DB_NAME=fw_furniture');
console.log('   DB_PORT=3306');
console.log('4. Run the server: npm run dev');

console.log('\n🔗 API Endpoints that will be available:');
console.log('   POST http://localhost:5000/api/auth/register');
console.log('   POST http://localhost:5000/api/auth/login');
console.log('   GET  http://localhost:5000/api/auth/profile (protected)');
console.log('   PUT  http://localhost:5000/api/auth/profile (protected)');
console.log('   GET  http://localhost:5000/api/health');

console.log('\n🎯 Next Steps:');
console.log('1. Edit .env file with your database credentials');
console.log('2. Create the MySQL database');
console.log('3. Run: npm run dev');
console.log('4. Test the API endpoints');

console.log('\n📚 For more information, see README.md'); 