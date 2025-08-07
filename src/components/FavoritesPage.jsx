import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import ProductCard from './ProductCard';
import { favoriteAPI } from '../services/api';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    fetchFavorites();
  }, [isLoggedIn, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await favoriteAPI.getUserFavorites(token);
      
      if (response.success) {
        setFavorites(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch favorites');
      }
    } catch (error) {
      setError('Error loading favorites');
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId) => {
    try {
      const response = await favoriteAPI.removeFromFavorites(productId, token);
      if (response.success) {
        // Remove the product from the local state
        setFavorites(prev => prev.filter(product => product.id !== productId));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <div className="favorites-page">
      <Header />
      
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>My Favorites</h1>
          <p>Your saved products</p>
        </div>

        {loading ? (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Loading your favorites...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchFavorites} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">♡</div>
            <h2>No favorites yet</h2>
            <p>Start adding products to your favorites to see them here</p>
            <button 
              onClick={() => navigate('/')} 
              className="browse-btn"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map(product => (
              <div key={product.id} className="favorite-item">
                <ProductCard product={product} />
                <button 
                  className="remove-favorite-btn"
                  onClick={() => handleRemoveFromFavorites(product.id)}
                  title="Remove from favorites"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage; 