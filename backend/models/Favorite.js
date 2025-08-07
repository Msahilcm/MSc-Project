const pool = require('../config/database').pool;

class Favorite {
  // Add a product to user's favorites
  static async addToFavorites(userId, productId) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
        [userId, productId]
      );
      return result.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Product is already in favorites
        return null;
      }
      throw error;
    }
  }

  // Remove a product from user's favorites
  static async removeFromFavorites(userId, productId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all favorite products for a user
  static async getUserFavorites(userId) {
    try {
      const [rows] = await pool.execute(`
        SELECT p.*, f.created_at as favorited_at
        FROM favorites f
        JOIN products p ON f.product_id = p.id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
      `, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Check if a product is favorited by a user
  static async isFavorited(userId, productId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get favorite count for a product
  static async getFavoriteCount(productId) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM favorites WHERE product_id = ?',
        [productId]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Favorite; 