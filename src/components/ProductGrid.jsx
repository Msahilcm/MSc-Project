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
    // Furniture filter (category) — allow case-insensitive match and whitespace normalization
    if (selectedFilters.category) {
      const sel = String(selectedFilters.category).toLowerCase().trim();
      const cat = String(product.category || '').toLowerCase().trim();
      if (sel && sel !== cat) {
        return false;
      }
    }

    // Global search filter across name, category, description
    if (selectedFilters.q) {
      const q = String(selectedFilters.q).toLowerCase().trim();
      if (q) {
        const hay = [
          String(product.name || ''),
          String(product.category || ''),
          String(product.description || '')
        ].join(' ').toLowerCase();
        if (!hay.includes(q)) {
          return false;
        }
      }
    }

    // Price filter
    if (selectedFilters.price) {
      const price = parseFloat(product.price);
      switch (selectedFilters.price) {
        case 'Under $50':
          if (price >= 50) return false;
          break;
        case '$50-$100':
          if (price < 50 || price > 100) return false;
          break;
        case '$100-$200':
          if (price < 100 || price > 200) return false;
          break;
        case '$200-$500':
          if (price < 200 || price > 500) return false;
          break;
        case 'Over $500':
          if (price <= 500) return false;
          break;
        default:
          break;
      }
    }

    return true;
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