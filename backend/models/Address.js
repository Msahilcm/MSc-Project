const { pool } = require('../config/database');

class Address {
  static async create(userId, data) {
    const { fullName, line1, line2, city, postalCode, country, phone, isDefault = false } = data;
    const [result] = await pool.execute(
      `INSERT INTO addresses (user_id, full_name, line1, line2, city, postal_code, country, phone, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, fullName, line1, line2 || null, city, postalCode, country, phone || null, !!isDefault]
    );
    if (isDefault) {
      await pool.execute(`UPDATE addresses SET is_default = FALSE WHERE user_id = ? AND id <> ?`, [userId, result.insertId]);
    }
    return { id: result.insertId };
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT id, full_name as fullName, line1, line2, city, postal_code as postalCode, country, phone, is_default as isDefault
       FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async update(userId, id, data) {
    const fields = [];
    const values = [];
    const map = {
      fullName: 'full_name', line1: 'line1', line2: 'line2', city: 'city', postalCode: 'postal_code', country: 'country', phone: 'phone'
    };
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && map[k]) { fields.push(`${map[k]} = ?`); values.push(v); }
    });
    if (fields.length === 0 && data.isDefault === undefined) return false;
    values.push(userId, id);
    const [res] = await pool.execute(`UPDATE addresses SET ${fields.join(', ')} WHERE user_id = ? AND id = ?`, values);
    if (data.isDefault === true) {
      await pool.execute(`UPDATE addresses SET is_default = FALSE WHERE user_id = ? AND id <> ?`, [userId, id]);
      await pool.execute(`UPDATE addresses SET is_default = TRUE WHERE user_id = ? AND id = ?`, [userId, id]);
    }
    return res.affectedRows > 0;
  }

  static async remove(userId, id) {
    const [res] = await pool.execute(`DELETE FROM addresses WHERE user_id = ? AND id = ?`, [userId, id]);
    return res.affectedRows > 0;
  }
}

module.exports = Address;

