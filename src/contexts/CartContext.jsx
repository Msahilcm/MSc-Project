import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity = 1, selectedColor = null) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.selectedColor === selectedColor
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          originalPrice: parseFloat(product.originalPrice || product.price),
          image: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images)[0] : product.images[0]) : null,
          quantity,
          selectedColor,
          stock: product.stock
        }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, selectedColor = null) => {
    setCart(prevCart => 
      prevCart.filter(item => !(item.id === productId && item.selectedColor === selectedColor))
    );
  };

  // Update item quantity
  const updateQuantity = (productId, quantity, selectedColor = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart count (total number of items)
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total price
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart items
  const getCartItems = () => {
    return cart;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    getCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 