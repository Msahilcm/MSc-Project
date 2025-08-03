import React from 'react';
import './ProductHeroBanner.css';

const ProductHeroBanner = () => {
  return (
    <div className="product-hero-banner">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Grab Upto 50% Off On Selected Furniture</h1>
          <p className="hero-subtitle">Discover amazing deals on premium furniture pieces</p>
          <button className="hero-cta-button">Shop Now</button>
        </div>
        <div className="hero-image">
          <img 
            src="/placeholder-hero.jpg" 
            alt="Furniture Collection" 
            className="hero-img"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductHeroBanner; 