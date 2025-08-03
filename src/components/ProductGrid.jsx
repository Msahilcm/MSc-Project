import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { productAPI } from '../services/api';
import './ProductGrid.css';

const ProductGrid = ({ selectedFilters, sortBy }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAllProducts();
        if (response.success) {
          setProducts(response.data || []);
        } else {
          setError('Failed to fetch products');
        }
      } catch (error) {
        setError('Error loading products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Add your filtering logic here based on selectedFilters
    return true; // For now, show all products
  });

  // Sort products based on sortBy
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      case 'Rating: High to Low':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="product-grid-container">
        <h2 className="product-grid-title">Furniture For You!</h2>
        <div className="loading-message">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid-container">
        <h2 className="product-grid-title">Furniture For You!</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="product-grid-container">
        <h2 className="product-grid-title">Furniture For You!</h2>
        <div className="no-products-message">
          <p>No products available yet.</p>
          <p>Products will appear here once an admin adds them to the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <h2 className="product-grid-title">Furniture For You!</h2>
      <div className="product-grid">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid; 