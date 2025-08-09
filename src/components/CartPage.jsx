import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useCart } from '../contexts/CartContext';
import placeholderImage from '../assets/placeholder2.jpg';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    getCartItems, 
    getCartTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const cartItems = getCartItems();
  const cartTotal = getCartTotal();

  const handleQuantityChange = (productId, newQuantity, selectedColor) => {
    updateQuantity(productId, newQuantity, selectedColor);
  };

  const handleRemoveItem = (productId, selectedColor) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(productId, selectedColor);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to place an order.');
      navigate('/login');
      return;
    }

    try {
      for (const item of cartItems) {
        const orderPayload = {
          productId: item.id,
          quantity: item.quantity,
          totalAmount: Number((item.price * item.quantity).toFixed(2)),
          shippingAddress: 'TBD - collected during checkout'
        };

        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderPayload)
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to create order');
        }
      }

      alert('Proceeding to checkout...');
      navigate('/checkout');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const getImageSrc = (imagePath) => {
    if (!imagePath) return placeholderImage;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <div className="cart-container">
          <div className="cart-header">
            <h1>Your Cart</h1>
          </div>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <button 
              onClick={() => navigate('/')} 
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <button onClick={handleClearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.selectedColor}-${index}`} className="cart-item">
                <div className="cart-item-image">
                  <img src={getImageSrc(item.image)} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  {item.selectedColor && (
                    <p className="cart-item-color">Color: {item.selectedColor}</p>
                  )}
                  <div className="cart-item-price">
                    <span className="current-price">${item.price.toFixed(2)}</span>
                    {item.originalPrice > item.price && (
                      <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.selectedColor)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.selectedColor)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id, item.selectedColor)}
                  className="remove-item-btn"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 