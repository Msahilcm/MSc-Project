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
  },
  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
      return await response.json();
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  // Add product review
  addProductReview: async (productId, review) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// Order API calls
export const orderAPI = {
  // Get all orders (admin only)
  getAllOrders: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { success: false, message: error.message };
    }
  },

  // Get order by ID
  getOrderById: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      return { success: false, message: error.message };
    }
  },

  // Create new order
  createOrder: async (orderData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, message: error.message };
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (id, status, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, message: error.message };
    }
  },

  // Get user's orders
  getUserOrders: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return { success: false, message: error.message };
    }
  },

  // Get order statistics (admin only)
  getOrderStatistics: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching order statistics:', error);
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
      const data = await response.json();
      if (data.success && data.data && data.data.user && data.data.user.name) {
        localStorage.setItem('userName', data.data.user.name);
      }
      return data;
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
  },

  // Get all users (admin only)
  getAllUsers: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, message: error.message };
    }
  }
};

// Favorites API calls
export const favoriteAPI = {
  // Add product to favorites
  addToFavorites: async (productId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { success: false, message: error.message };
    }
  },

  // Remove product from favorites
  removeFromFavorites: async (productId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }
      return await response.json();
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { success: false, message: error.message };
    }
  },

  // Get user's favorite products
  getUserFavorites: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return { success: false, message: error.message };
    }
  },

  // Check if product is favorited by user
  checkIfFavorited: async (productId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${productId}/check`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to check favorite status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return { success: false, message: error.message };
    }
  }
}; 