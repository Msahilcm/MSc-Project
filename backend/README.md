# FW Furniture Backend

A Node.js backend API for the FW Furniture website with user authentication and profile management.

## Features

- ✅ User registration with validation
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Profile management (get/update)
- ✅ Input validation and sanitization
- ✅ MySQL database integration
- ✅ CORS support for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend folder:**
   ```bash
   cd fw-furniture/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your database credentials
   nano .env
   ```

4. **Configure your .env file:**
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

5. **Create MySQL database:**
   ```sql
   CREATE DATABASE fw_furniture;
   ```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123",
    "name": "John",
    "surname": "Doe",
    "phone_prefix": "+44",
    "telephone": "1234567890"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John",
        "surname": "Doe",
        "phone_prefix": "+44",
        "telephone": "1234567890"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John",
        "surname": "Doe",
        "phone_prefix": "+44",
        "telephone": "1234567890"
      },
      "token": "jwt_token_here"
    }
  }
  ```

### Protected Routes (Require Authorization Header)

#### Get User Profile
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John",
        "surname": "Doe",
        "phone_prefix": "+44",
        "telephone": "1234567890",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

#### Update User Profile
- **PUT** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Jane",
    "surname": "Smith",
    "telephone": "0987654321"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "Jane",
        "surname": "Smith",
        "phone_prefix": "+44",
        "telephone": "0987654321",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

### Health Check
- **GET** `/api/health`
- **Response:**
  ```json
  {
    "message": "FW Furniture Backend is running!"
  }
  ```

## Validation Rules

### Registration
- Email must be valid
- Password must be at least 6 characters with uppercase, lowercase, and number
- Name and surname must be 2-100 characters (letters and spaces only)
- Phone prefix is optional (1-10 characters)
- Telephone is optional (10-20 characters, numbers and special chars only)

### Login
- Email must be valid
- Password is required

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // For validation errors
}
```

## Database Schema

### Users Table
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

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation and sanitization
- ✅ SQL injection prevention with parameterized queries
- ✅ CORS protection
- ✅ Environment variable configuration

## Frontend Integration

To connect your React frontend to this backend:

1. **Update your frontend API calls to use the backend URL:**
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

2. **Store JWT token in localStorage or secure storage:**
   ```javascript
   localStorage.setItem('token', response.data.token);
   ```

3. **Include token in API requests:**
   ```javascript
   const headers = {
     'Authorization': `Bearer ${localStorage.getItem('token')}`,
     'Content-Type': 'application/json'
   };
   ```

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js
├── controllers/
│   └── authController.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── server.js
├── package.json
└── README.md
```

### Adding New Features
1. Create new models in `models/`
2. Add controllers in `controllers/`
3. Create routes in `routes/`
4. Add validation in `middleware/validation.js`
5. Update `server.js` to include new routes

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **JWT Token Issues**
   - Check JWT_SECRET in `.env`
   - Verify token format in Authorization header

3. **CORS Issues**
   - Update CORS_ORIGIN in `.env` to match your frontend URL
   - Check browser console for CORS errors

## License

MIT License 