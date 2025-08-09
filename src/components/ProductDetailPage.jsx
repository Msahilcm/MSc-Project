import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState(null);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Robust userName fallback logic
  let userName = localStorage.getItem('userName') || '';
  if (!userName) {
    // Try to get from user object
    try {
      const userObj = JSON.parse(localStorage.getItem('user'));
      if (userObj && userObj.name) userName = userObj.name;
    } catch {}
    try {
      const adminObj = JSON.parse(localStorage.getItem('adminUser'));
      if (!userName && adminObj && adminObj.name) userName = adminObj.name;
    } catch {}
  }
  const isLoggedIn = !!userName;

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getProductById(productId);
        if (response.success && response.data) {
          setProduct(response.data);
          // Set the first color as default selected color
          if (response.data.colors && response.data.colors.length > 0) {
            const firstColor = response.data.colors[0];
            const colorName = typeof firstColor === 'string' ? firstColor : firstColor.name;
            setSelectedColor(colorName);
          }
        } else {
          setError('Product not found');
        }
      } catch (error) {
        setError('Failed to load product');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const res = await productAPI.getProductReviews(productId);
        if (res.success && res.data) {
          setReviews(res.data);
        } else {
          setReviews([]);
          setReviewsError(res.message || 'Failed to load reviews');
        }
      } catch (error) {
        setReviews([]);
        setReviewsError('Failed to load reviews');
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const selectedColorStock = getSelectedColorStock();
    if (newQuantity >= 1 && newQuantity <= selectedColorStock) {
      setQuantity(newQuantity);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Helper function to get color object by name
  const getColorObject = (colorName) => {
    if (!product || !product.colors || !colorName) return null;
    return product.colors.find(color => {
      if (typeof color === 'string') {
        return color === colorName;
      }
      return color && color.name === colorName;
    });
  };

  // Helper function to get stock for selected color
  const getSelectedColorStock = () => {
    if (!selectedColor || !product) return 0;
    const colorObj = getColorObject(selectedColor);
    if (!colorObj) return 0;
    return typeof colorObj === 'string' ? product.stock : (colorObj.stock || 0);
  };

  // Helper function to check if color is in stock
  const isColorInStock = (colorName) => {
    if (!colorName || !product) return false;
    const colorObj = getColorObject(colorName);
    if (!colorObj) return false;
    const stock = typeof colorObj === 'string' ? product.stock : (colorObj.stock || 0);
    return stock > 0;
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleNextImage = () => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!product || !product.images || product.images.length <= 1) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevImage();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [product]);

  // Handle review form input
  const handleReviewInput = (e) => {
    const { name, value } = e.target;
    setReviewForm(f => ({ ...f, [name]: value }));
  };

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setReviewSubmitError('Please log in to leave a review');
      return;
    }

    setReviewSubmitting(true);
    setReviewSubmitError(null);
    setReviewSubmitSuccess(null);

    try {
      const res = await productAPI.addProductReview(productId, {
        user_name: userName,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });

      if (res.success) {
        setReviewSubmitSuccess('Review submitted successfully!');
        setReviewForm({ rating: 5, comment: '' });
        // Refresh reviews
        const reviewsRes = await productAPI.getProductReviews(productId);
        setReviews(reviewsRes.success && reviewsRes.data ? reviewsRes.data : []);
      } else {
        setReviewSubmitError(res.message || 'Failed to submit review');
      }
    } catch (error) {
      setReviewSubmitError('Error submitting review');
      console.error('Review submit error:', error);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedColor) {
      alert('Please select a color first');
      return;
    }
    
    if (getSelectedColorStock() === 0) {
      alert('This color is out of stock');
      return;
    }

    addToCart(product, quantity, selectedColor);
    alert(`Added ${quantity} ${product.name} (${selectedColor}) to cart!`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Star rating input for review form
  const renderStarInput = () => (
    <div className="star-input">
      {[1,2,3,4,5].map(v => (
        <span
          key={v}
          className={`star ${v <= reviewForm.rating ? 'filled' : ''}`}
          style={{ cursor: reviewSubmitting ? 'not-allowed' : 'pointer', fontSize: '1.5rem', color: v <= reviewForm.rating ? '#F59E0B' : '#ccc' }}
          onClick={() => !reviewSubmitting && setReviewForm(f => ({ ...f, rating: v }))}
          aria-label={`Rate ${v} star${v>1?'s':''}`}
        >★</span>
      ))}
    </div>
  );

  // Average rating calculation
  const averageRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;

  if (loading) {
    return (
      <>
        <Header />
        <div className="product-detail-page">
          <div className="loading-message">Loading product...</div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="product-detail-page">
          <div className="error-message">{error || 'Product not found'}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="product-detail-page">
        <div className="product-detail-container">
          {/* Breadcrumb */}
          <div className="breadcrumb-nav">
            <span className="breadcrumb-text">
              Furniture / {product.category} / {product.name}
            </span>
          </div>

          <div className="product-detail-content">
            {/* Left Panel - Product Images */}
            <div className="product-images-section">
              <div className="main-image-container">
                <img 
                  src={getImageUrl(product.images[selectedImageIndex])} 
                  alt={product.name} 
                  className="main-product-image"
                />
                {/* Navigation buttons */}
                {product.images.length > 1 && (
                  <>
                    <button 
                      className="image-nav-btn prev-btn"
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button 
                      className="image-nav-btn next-btn"
                      onClick={handleNextImage}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
                {/* Image counter */}
                {product.images.length > 1 && (
                  <div className="image-counter">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-container ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => handleImageSelect(index)}
                  >
                    <img 
                      src={getImageUrl(image)} 
                      alt={`${product.name} ${index + 1}`} 
                      className="thumbnail-image"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Product Details */}
            <div className="product-details-section">
              <h1 className="product-name">{product.name}</h1>
              <p className="product-description">{product.description}</p>
              
              {/* Rating */}
              <div className="product-rating">
                <div className="stars">
                  {renderStars(product.rating)}
                </div>
                <span className="reviews-count">({product.reviews})</span>
              </div>

                             {/* Pricing */}
               <div className="product-pricing">
                 <div className="price-main">
                   ${parseFloat(product.price).toFixed(2)}
                 </div>
               </div>

                             {/* Color Selection */}
               <div className="color-selection">
                 <h3>Choose a Color</h3>
                 <div className="color-options">
                   {product.colors.map((colorObj) => {
                     const colorName = typeof colorObj === 'string' ? colorObj : colorObj.name;
                     const isInStock = isColorInStock(colorName);
                     const stockCount = typeof colorObj === 'string' ? product.stock : colorObj.stock;
                     
                     // Skip rendering if colorName is not a valid string
                     if (!colorName || typeof colorName !== 'string') {
                       return null;
                     }
                     
                     return (
                       <button
                         key={colorName}
                         className={`color-option ${selectedColor === colorName ? 'selected' : ''} ${!isInStock ? 'out-of-stock' : ''}`}
                         onClick={() => isInStock && handleColorSelect(colorName)}
                         style={{ backgroundColor: colorName.toLowerCase() }}
                         disabled={!isInStock}
                         title={!isInStock ? 'Out of Stock' : `${stockCount} in stock`}
                       >
                         {colorName}
                         {!isInStock && <span className="out-of-stock-label">Out of Stock</span>}
                       </button>
                     );
                   })}
                 </div>
               </div>

                             {/* Quantity and Stock */}
               <div className="quantity-section">
                 <div className="quantity-selector">
                   <button 
                     className="quantity-btn"
                     onClick={() => handleQuantityChange(-1)}
                     disabled={quantity <= 1}
                   >
                     -
                   </button>
                   <span className="quantity-display">{quantity}</span>
                   <button 
                     className="quantity-btn"
                     onClick={() => handleQuantityChange(1)}
                     disabled={quantity >= getSelectedColorStock()}
                   >
                     +
                   </button>
                 </div>
                                   <div className="stock-info">
                    {selectedColor && getSelectedColorStock() > 0 ? (
                      `Only ${getSelectedColorStock()} Items Left in ${selectedColor}! Don't miss it`
                    ) : selectedColor ? (
                      <span className="out-of-stock-text">Out of Stock for {selectedColor}</span>
                    ) : (
                      <span className="out-of-stock-text">Please select a color</span>
                    )}
                  </div>
               </div>

                             {/* Action Buttons */}
               <div className="action-buttons">
                  <button 
                   className="buy-now-btn" 
                   disabled={getSelectedColorStock() === 0}
                   onClick={() => {
                     if (!product) return;
                     if (!selectedColor) return;
                     addToCart(product, 1, selectedColor);
                     navigate('/checkout');
                   }}
                  >
                    {getSelectedColorStock() === 0 ? 'Out of Stock' : 'Buy Now'}
                  </button>
                 <button 
                   className="add-to-cart-btn" 
                   disabled={getSelectedColorStock() === 0}
                   onClick={handleAddToCart}
                 >
                   {getSelectedColorStock() === 0 ? 'Out of Stock' : 'Add to Cart'}
                 </button>
               </div>

              {/* Delivery Information */}
              <div className="delivery-info">
                <div className="delivery-item">
                  <div className="delivery-icon">🚚</div>
                  <div className="delivery-content">
                    <h4>Free Delivery</h4>
                    <p>Enter your Postal code for Delivery Availability</p>
                  </div>
                </div>
                <div className="delivery-item">
                  <div className="delivery-icon">📦</div>
                  <div className="delivery-content">
                    <h4>Return Delivery</h4>
                    <p>Free 30 days Delivery Returns. Details</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="review-section">
        <h2>Reviews</h2>
        <div className="average-rating">
          <span className="average-stars">
            {[1,2,3,4,5].map(v => (
              <span key={v} className={`star ${v <= Math.round(averageRating) ? 'filled' : ''}`} style={{ color: v <= Math.round(averageRating) ? '#F59E0B' : '#ccc', fontSize: '1.3rem' }}>★</span>
            ))}
          </span>
          <span className="review-count">{averageRating ? averageRating.toFixed(1) : '0.0'} / 5.0 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
        </div>
        {reviewsLoading ? (
          <div className="review-loading">Loading reviews...</div>
        ) : reviewsError ? (
          <div className="review-error">{reviewsError}</div>
        ) : reviews.length === 0 ? (
          <div className="review-error">No reviews yet. Be the first to review!</div>
        ) : (
          <div className="review-list">
            {reviews.map(r => (
              <div className="review-item" key={r.id}>
                <div className="review-header">
                  <span className="review-user">{r.user_name}</span>
                  <span className="review-rating">
                    {[1,2,3,4,5].map(v => (
                      <span key={v} className={`star ${v <= r.rating ? 'filled' : ''}`} style={{ color: v <= r.rating ? '#F59E0B' : '#ccc' }}>★</span>
                    ))}
                  </span>
                  <span className="review-date">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <div className="review-comment">{r.comment}</div>
              </div>
            ))}
          </div>
        )}
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <h3>Leave a Review</h3>
          {!isLoggedIn && (
            <div className="review-error">Please log in to leave a review.</div>
          )}
          {renderStarInput()}
          <textarea
            name="comment"
            className="review-input"
            placeholder="Your Review"
            value={reviewForm.comment}
            onChange={handleReviewInput}
            rows={3}
            required
            disabled={!isLoggedIn || reviewSubmitting}
          />
          <button type="submit" className="review-submit-btn" disabled={!isLoggedIn || reviewSubmitting}>
            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          {reviewSubmitError && <div className="review-error">{reviewSubmitError}</div>}
          {reviewSubmitSuccess && <div className="review-success">{reviewSubmitSuccess}</div>}
        </form>
      </div>
    </>
  );
};

export default ProductDetailPage; 