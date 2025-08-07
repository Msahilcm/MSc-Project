const pool = require('./config/database').pool;

async function createTestOrder() {
  try {
    // First, let's check if we have any users and products
    const [users] = await pool.execute('SELECT id FROM users LIMIT 1');
    const [products] = await pool.execute('SELECT id FROM products LIMIT 1');
    
    if (users.length === 0) {
      console.log('No users found. Please create a user first.');
      return;
    }
    
    if (products.length === 0) {
      console.log('No products found. Please create a product first.');
      return;
    }
    
    const userId = users[0].id;
    const productId = products[0].id;
    
    // Create a test order
    const [result] = await pool.execute(`
      INSERT INTO orders (user_id, product_id, quantity, total_amount, status, shipping_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [userId, productId, 2, 299.99, 'pending', '123 Test Street, Test City, TC 12345']);
    
    console.log('Test order created successfully!');
    console.log('Order ID:', result.insertId);
    console.log('User ID:', userId);
    console.log('Product ID:', productId);
    
  } catch (error) {
    console.error('Error creating test order:', error);
  } finally {
    process.exit(0);
  }
}

createTestOrder(); 