const API_BASE_URL = 'http://localhost:5000/api';

// Product API calls
export const productAPI = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, data: [] };
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return { success: false, data: null };
    }
  },

  // Create new product (admin only)
  createProduct: async (productData, token) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // If productData is FormData, don't set Content-Type (let browser set it with boundary)
      if (!(productData instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers,
        body: productData instanceof FormData ? productData : JSON.stringify(productData)
      });
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      return { success: false, message: error.message };
    }
  },

  // Update product (admin only)
  updateProduct: async (id, productData, token) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // If productData is FormData, don't set Content-Type (let browser set it with boundary)
      if (!(productData instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers,
        body: productData instanceof FormData ? productData : JSON.stringify(productData)
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, message: error.message };
    }
  },

  // Delete product (admin only)
  deleteProduct: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, message: error.message };
    }
  }
};

// Auth API calls
export const authAPI = {
  // Login
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: error.message };
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error registering:', error);
      return { success: false, message: error.message };
    }
  },

  // Get user profile
  getProfile: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { success: false, message: error.message };
    }
  }
}; 