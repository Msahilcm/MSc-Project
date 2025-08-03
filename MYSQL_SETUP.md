# 🗄️ MySQL Database Setup for FW Furniture Backend

## 🎯 **Goal: Set up MySQL database for user login/register functionality**

### 📋 **Prerequisites:**

1. **MySQL Server** - Download and install from [MySQL Official Website](https://dev.mysql.com/downloads/mysql/)
2. **MySQL Workbench** (optional but recommended) - For database management

---

## 🚀 **Step-by-Step Setup:**

### **Step 1: Install MySQL Server**

1. **Download MySQL:**
   - Go to: https://dev.mysql.com/downloads/mysql/
   - Download "MySQL Installer for Windows"
   - Run the installer

2. **Installation Options:**
   - Choose "Developer Default" or "Server only"
   - Set root password (remember this!)
   - Complete installation

### **Step 2: Verify MySQL Installation**

Open Command Prompt and test:
```bash
mysql --version
```

### **Step 3: Create Database**

1. **Open MySQL Command Line:**
   ```bash
   mysql -u root -p
   ```
   (Enter your root password when prompted)

2. **Create the database:**
   ```sql
   CREATE DATABASE fw_furniture;
   SHOW DATABASES;
   EXIT;
   ```

### **Step 4: Configure Backend Environment**

1. **Navigate to backend directory:**
   ```bash
   cd fw-furniture/backend
   ```

2. **Edit .env file** with your MySQL credentials:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=fw_furniture
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

### **Step 5: Test Database Connection**

1. **Stop the test server** (if running)
2. **Start the full server:**
   ```bash
   npm run dev
   ```

3. **Check for success messages:**
   ```
   ✅ Database connected successfully!
   ✅ Database tables initialized successfully!
   🚀 Server is running on port 5000
   ```

---

## 🧪 **Testing the Full Backend:**

### **Test 1: Register a New User**

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

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "John",
      "surname": "Doe",
      "phone_prefix": "+44",
      "telephone": "1234567890"
    },
    "token": "jwt_token_here"
  }
}
```

### **Test 2: Login with Registered User**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "name": "John",
      "surname": "Doe",
      "phone_prefix": "+44",
      "telephone": "1234567890"
    },
    "token": "jwt_token_here"
  }
}
```

---

## 🔧 **Frontend Testing:**

1. **Start React frontend:**
   ```bash
   cd fw-furniture
   npm start
   ```

2. **Test Registration:**
   - Go to: http://localhost:3000/register
   - Fill out the form
   - Submit and check for success

3. **Test Login:**
   - Go to: http://localhost:3000/login/form
   - Use the email/password you registered
   - Submit and check for success

---

## 🚨 **Troubleshooting:**

### **Issue 1: "Database connection failed"**
**Solution:**
- Check MySQL is running
- Verify credentials in .env file
- Ensure database exists

### **Issue 2: "Access denied for user"**
**Solution:**
- Check DB_USER and DB_PASSWORD in .env
- Try: `mysql -u root -p` to test connection

### **Issue 3: "Database doesn't exist"**
**Solution:**
```sql
CREATE DATABASE fw_furniture;
```

### **Issue 4: "Port 5000 already in use"**
**Solution:**
- Stop any running servers
- Or change PORT in .env file

---

## ✅ **Success Indicators:**

When everything is working correctly, you should see:

1. **Backend startup:**
   ```
   ✅ Database connected successfully!
   ✅ Database tables initialized successfully!
   🚀 Server is running on port 5000
   ```

2. **User registration works**
3. **User login works**
4. **Frontend forms connect successfully**
5. **JWT tokens are generated and stored**

---

## 🎉 **What You'll Have:**

- ✅ **Persistent user storage** in MySQL
- ✅ **Secure password hashing** with bcrypt
- ✅ **JWT token authentication**
- ✅ **Form validation** on frontend and backend
- ✅ **Error handling** and user feedback
- ✅ **Complete login/register system**

Your FW Furniture website will have a fully functional authentication system with database storage! 