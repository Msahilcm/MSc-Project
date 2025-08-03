import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

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

  // Get the first image from the images array or use a placeholder
  const getImageSrc = () => {
    if (product.images && product.images.length > 0) {
      const imagePath = product.images[0];
      // If it's already a full URL, use it as is
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      // Otherwise, prepend the backend URL
      return `http://localhost:5000${imagePath}`;
    }
    return '/placeholder.jpg'; // Fallback image
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img src={getImageSrc()} alt={product.name} className="product-image" />
        {discount > 0 && (
          <div className="discount-badge">-{discount}%</div>
        )}
        <button className="wishlist-btn" title="Add to Wishlist">
          ♡
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
        
        <button className="add-to-cart-btn" title="Add to Cart">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 