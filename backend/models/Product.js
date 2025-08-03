const { pool } = require('../config/database');

class Product {
  static async create(productData) {
    try {
      const {
        name,
        description,
        price,
        category,
        stock,
        colors,
        images,
        rating = 0,
        reviews = 0
      } = productData;

      const [result] = await pool.execute(`
        INSERT INTO products (name, description, price, category, stock, colors, images, rating, reviews)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name,
        description,
        price,
        category,
        stock,
        colors, // Already JSON string from controller
        images, // Already JSON string from controller
        rating,
        reviews
      ]);

      return result.insertId;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM products ORDER BY created_at DESC
      `);
      
      return rows.map(row => {
        const colors = JSON.parse(row.colors || '[]');
        // Convert color strings to objects if they're not already
        const processedColors = colors.map(color => {
          if (typeof color === 'string') {
            return { name: color, stock: row.stock };
          }
          return color;
        });
        
        return {
          ...row,
          colors: processedColors,
          images: JSON.parse(row.images || '[]')
        };
      });
    } catch (error) {
      console.error('Find all products error:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM products WHERE id = ?
      `, [id]);

      if (rows.length === 0) return null;

      const product = rows[0];
      const colors = JSON.parse(product.colors || '[]');
      // Convert color strings to objects if they're not already
      const processedColors = colors.map(color => {
        if (typeof color === 'string') {
          return { name: color, stock: product.stock };
        }
        return color;
      });
      
      return {
        ...product,
        colors: processedColors,
        images: JSON.parse(product.images || '[]')
      };
    } catch (error) {
      console.error('Find product by ID error:', error);
      throw error;
    }
  }

  static async update(id, productData) {
    try {
      console.log('Product.update called with ID:', id);
      console.log('Product data:', productData);

      // Get existing product to preserve unchanged fields
      const existingProduct = await this.findById(id);
      if (!existingProduct) {
        console.log('Product not found for update');
        return false;
      }

      // Merge existing data with update data
      const updateData = {
        name: productData.name || existingProduct.name,
        description: productData.description || existingProduct.description,
        price: productData.price || existingProduct.price,
        category: productData.category || existingProduct.category,
        stock: productData.stock || existingProduct.stock,
        colors: productData.colors || JSON.stringify(existingProduct.colors),
        images: productData.images || JSON.stringify(existingProduct.images),
        rating: productData.rating !== undefined ? productData.rating : existingProduct.rating,
        reviews: productData.reviews !== undefined ? productData.reviews : existingProduct.reviews
      };

      console.log('Final update data:', updateData);

      const [result] = await pool.execute(`
        UPDATE products 
        SET name = ?, description = ?, price = ?, category = ?, 
            stock = ?, colors = ?, images = ?, rating = ?, reviews = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        updateData.name,
        updateData.description,
        updateData.price,
        updateData.category,
        updateData.stock,
        updateData.colors,
        updateData.images,
        updateData.rating,
        updateData.reviews,
        id
      ]);

      console.log('Update result:', result);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(`
        DELETE FROM products WHERE id = ?
      `, [id]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }
}

module.exports = Product; 