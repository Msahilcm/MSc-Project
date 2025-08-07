import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteAPI } from '../services/api';
import placeholderImage from '../assets/placeholder2.jpg';
import { useCart } from '../contexts/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');
  const token = localStorage.getItem('token');

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.price) {
      const originalPrice = parseFloat(product.originalPrice);
      const currentPrice = parseFloat(product.price);
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  // Check if product is favorited on component mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isLoggedIn && token) {
        try {
          const response = await favoriteAPI.checkIfFavorited(product.id, token);
          if (response.success) {
            setIsFavorited(response.data.isFavorited);
          }
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [product.id, isLoggedIn, token]);

  // Handle favorite toggle
  const handleFavoriteToggle = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (!isLoggedIn) {
      alert('Please log in to add products to favorites');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        const response = await favoriteAPI.removeFromFavorites(product.id, token);
        if (response.success) {
          setIsFavorited(false);
        }
      } else {
        const response = await favoriteAPI.addToFavorites(product.id, token);
        if (response.success) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click
    addToCart(product, 1);
    alert('Product added to cart!');
  };

  // Get the first image from the images array or use a placeholder
  const getImageSrc = () => {
    try {
      let images = product.images;
      
      console.log('Product images raw:', images); // Debug log
      console.log('Product images type:', typeof images); // Debug log
      
      // If images is a string (JSON), parse it
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images);
          console.log('Parsed images:', images); // Debug log
        } catch (parseError) {
          console.error('Error parsing images JSON:', parseError);
          images = [];
        }
      }
      
      // If images is an array and has items
      if (Array.isArray(images) && images.length > 0) {
        const imagePath = images[0];
        console.log('Selected image path:', imagePath); // Debug log
        // If it's already a full URL, use it as is
        if (imagePath.startsWith('http')) {
          return imagePath;
        }
        // Otherwise, prepend the backend URL
        return `http://localhost:5000${imagePath}`;
      }
      
      // Fallback to placeholder
      return placeholderImage;
    } catch (error) {
      console.error('Error getting image source:', error);
      return placeholderImage;
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img src={getImageSrc()} alt={product.name} className="product-image" />
        {discount > 0 && (
          <div className="discount-badge">-{discount}%</div>
        )}
        <button 
          className={`wishlist-btn ${isFavorited ? 'wishlisted' : ''}`} 
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          onClick={handleFavoriteToggle}
          disabled={isLoading}
        >
          {isFavorited ? '♥' : '♡'}
        </button>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < product.rating ? 'filled' : ''}`}>
                ★
              </span>
            ))}
          </div>
          <span className="rating-count">({product.reviews})</span>
        </div>
        
        <div className="product-price">
          {discount > 0 && (
            <span className="original-price">${parseFloat(product.originalPrice || 0).toFixed(2)}</span>
          )}
          <span className="current-price">${parseFloat(product.price || 0).toFixed(2)}</span>
        </div>
        
        <button 
          className="add-to-cart-btn" 
          title="Add to Cart"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 