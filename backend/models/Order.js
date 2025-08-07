const pool = require('../config/database').pool;

class Order {
  // Create a new order
  static async create(orderData) {
    try {
      const { userId, productId, quantity, totalAmount, status = 'pending', shippingAddress } = orderData;
      
      const [result] = await pool.execute(`
        INSERT INTO orders (user_id, product_id, quantity, total_amount, status, shipping_address, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `, [userId, productId, quantity, totalAmount, status, shippingAddress]);
      
      return { id: result.insertId, ...orderData };
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  // Get all orders with user and product details
  static async findAll() {
    try {
      const [orders] = await pool.execute(`
        SELECT 
          o.id,
          o.user_id,
          o.product_id,
          o.quantity,
          o.total_amount,
          o.status,
          o.shipping_address,
          o.created_at,
          u.name as user_name,
          u.email as user_email,
          p.name as product_name,
          p.price as product_price
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN products p ON o.product_id = p.id
        ORDER BY o.created_at DESC
      `);
      
      return orders;
    } catch (error) {
      console.error('Find all orders error:', error);
      throw error;
    }
  }

  // Get order by ID
  static async findById(id) {
    try {
      const [orders] = await pool.execute(`
        SELECT 
          o.id,
          o.user_id,
          o.product_id,
          o.quantity,
          o.total_amount,
          o.status,
          o.shipping_address,
          o.created_at,
          u.name as user_name,
          u.email as user_email,
          p.name as product_name,
          p.price as product_price
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN products p ON o.product_id = p.id
        WHERE o.id = ?
      `, [id]);
      
      return orders[0] || null;
    } catch (error) {
      console.error('Find by ID error:', error);
      throw error;
    }
  }

  // Update order status
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(`
        UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?
      `, [status, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  }

  // Get orders by user ID
  static async findByUserId(userId) {
    try {
      const [orders] = await pool.execute(`
        SELECT 
          o.id,
          o.user_id,
          o.product_id,
          o.quantity,
          o.total_amount,
          o.status,
          o.shipping_address,
          o.created_at,
          p.name as product_name,
          p.price as product_price
        FROM orders o
        LEFT JOIN products p ON o.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `, [userId]);
      
      return orders;
    } catch (error) {
      console.error('Find by user ID error:', error);
      throw error;
    }
  }

  // Get order statistics by time period
  static async getOrderStatistics() {
    try {
      const [todayOrders] = await pool.execute(`
        SELECT COUNT(*) as count, SUM(total_amount) as total
        FROM orders 
        WHERE DATE(created_at) = CURDATE()
      `);

      const [monthOrders] = await pool.execute(`
        SELECT COUNT(*) as count, SUM(total_amount) as total
        FROM orders 
        WHERE YEAR(created_at) = YEAR(CURDATE()) 
        AND MONTH(created_at) = MONTH(CURDATE())
      `);

      const [yearOrders] = await pool.execute(`
        SELECT COUNT(*) as count, SUM(total_amount) as total
        FROM orders 
        WHERE YEAR(created_at) = YEAR(CURDATE())
      `);

      return {
        today: {
          count: todayOrders[0].count || 0,
          total: todayOrders[0].total || 0
        },
        month: {
          count: monthOrders[0].count || 0,
          total: monthOrders[0].total || 0
        },
        year: {
          count: yearOrders[0].count || 0,
          total: yearOrders[0].total || 0
        }
      };
    } catch (error) {
      console.error('Get order statistics error:', error);
      throw error;
    }
  }
}

module.exports = Order; 