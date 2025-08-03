# FW Furniture Backend Setup Guide

## 🎯 What We've Built

A complete Node.js backend with MySQL database for your FW Furniture website that includes:

### ✅ Features
- **User Registration** - Create new accounts with validation
- **User Login** - Secure authentication with JWT tokens
- **Password Security** - Bcrypt hashing for secure password storage
- **Profile Management** - Get and update user profiles
- **Input Validation** - Comprehensive form validation
- **Database Integration** - MySQL with connection pooling
- **CORS Support** - Ready for frontend integration
- **Error Handling** - Proper error responses

### 📁 Backend Structure
```
backend/
├── config/
│   └── database.js          # MySQL connection and setup
├── controllers/
│   └── authController.js     # Login/Register logic
├── middleware/
│   ├── auth.js              # JWT token verification
│   └── validation.js        # Input validation rules
├── models/
│   └── User.js              # Database operations
├── routes/
│   └── auth.js              # API endpoints
├── server.js                # Main server file
├── package.json             # Dependencies
├── setup.js                 # Setup helper
└── README.md               # Detailed documentation
```

## 🚀 Quick Start

### 1. Navigate to Backend Directory
```bash
cd fw-furniture/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Setup Script
```bash
npm run setup
```

### 4. Configure Environment
Edit the `.env` file with your MySQL credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fw_furniture
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 5. Create MySQL Database
```sql
CREATE DATABASE fw_furniture;
```

### 6. Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 🔗 API Endpoints

### Authentication

#### Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John",
  "surname": "Doe",
  "phone_prefix": "+44",
  "telephone": "1234567890"
}
```

#### Login User
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

#### Get Profile (Protected)
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <your_jwt_token>
```

#### Update Profile (Protected)
```http
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "Jane",
  "surname": "Smith",
  "telephone": "0987654321"
}
```

## 🔧 Frontend Integration

Your React frontend is already updated to connect with the backend:

### Login Form (`LoginFormPage.jsx`)
- ✅ Form validation
- ✅ API integration
- ✅ Error handling
- ✅ Loading states
- ✅ Token storage

### Register Form (`RegisterFormPage.jsx`)
- ✅ Form validation
- ✅ API integration
- ✅ Error handling
- ✅ Loading states
- ✅ Token storage

### How It Works
1. User fills out login/register form
2. Form data is sent to backend API
3. Backend validates data and processes request
4. JWT token is returned and stored in localStorage
5. User is redirected to main page
6. Token is used for protected API calls

## 🛡️ Security Features

- **Password Hashing** - Bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Comprehensive form validation
- **SQL Injection Prevention** - Parameterized queries
- **CORS Protection** - Cross-origin request handling
- **Environment Variables** - Secure configuration

## 📊 Database Schema

The backend automatically creates the users table:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  phone_prefix VARCHAR(10) DEFAULT '+44',
  telephone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🧪 Testing the API

### Using curl or Postman:

1. **Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "name": "John",
    "surname": "Doe",
    "phone_prefix": "+44",
    "telephone": "1234567890"
  }'
```

2. **Login with the user:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

3. **Get profile (use token from login response):**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify credentials in `.env`
   - Ensure database exists

2. **CORS Errors**
   - Check CORS_ORIGIN in `.env`
   - Ensure frontend URL matches

3. **JWT Token Issues**
   - Check JWT_SECRET in `.env`
   - Verify token format in Authorization header

4. **Validation Errors**
   - Check password requirements (uppercase, lowercase, number)
   - Ensure email format is valid
   - Verify name/surname are letters only

## 🎉 Success!

Once everything is set up:

1. ✅ Backend server running on port 5000
2. ✅ Database connected and tables created
3. ✅ Frontend forms connected to backend
4. ✅ User registration and login working
5. ✅ JWT tokens being stored and used

Your FW Furniture website now has a complete authentication system!

## 📚 Next Steps

- Add more user features (password reset, email verification)
- Implement product management
- Add shopping cart functionality
- Create admin panel
- Add payment processing

## 🆘 Need Help?

Check the detailed documentation in `backend/README.md` for more information about the API endpoints, validation rules, and advanced features. 