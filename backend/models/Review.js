const pool = require('../config/database').pool;

class Review {
  static async findByProductId(productId) {
    const [rows] = await pool.execute(
      'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );
    return rows;
  }

  static async create({ product_id, user_name, rating, comment }) {
    const [result] = await pool.execute(
      'INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)',
      [product_id, user_name, rating, comment]
    );
    return result.insertId;
  }
}

module.exports = Review;