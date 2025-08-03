const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create(userData) {
    try {
      const { email, password, name, surname, phone_prefix, telephone } = userData;
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.execute(
        'INSERT INTO users (email, password, name, surname, phone_prefix, telephone) VALUES (?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, name, surname, phone_prefix, telephone]
      );
      
      return { id: result.insertId, email, name, surname, phone_prefix, telephone };
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, email, password, name, surname, phone_prefix, telephone, profile_image, isAdmin FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Find by email error:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, email, password, name, surname, phone_prefix, telephone, profile_image, isAdmin FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Find by ID error:', error);
      throw error;
    }
  }

  // Update user
  static async update(id, updateData) {
    try {
      const allowedFields = ['name', 'surname', 'phone_prefix', 'telephone'];
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        return false;
      }

      values.push(id);
      const [result] = await pool.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Update password
  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const [result] = await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  // Update profile image
  static async updateProfileImage(id, imagePath) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET profile_image = ? WHERE id = ?',
        [imagePath, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Update profile image error:', error);
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      if (!hashedPassword) {
        console.log('No hashed password provided for verification');
        return false;
      }
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }
}

module.exports = User; 