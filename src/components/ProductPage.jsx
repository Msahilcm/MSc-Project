import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProductHeroBanner from './ProductHeroBanner';
import ProductFilterBar from './ProductFilterBar';
import ProductGrid from './ProductGrid';
import './ProductPage.css';
import { useLocation } from 'react-router-dom';

const ProductPage = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    price: '',
    review: '',
    color: '',
    material: '',
    offer: ''
  });
  const [sortBy, setSortBy] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const q = params.get('q');
    if (category) {
      setSelectedFilters(prev => ({ ...prev, category }));
    }
    if (q) {
      setSelectedFilters(prev => ({ ...prev, q }));
    }
  }, [location.search]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <>
      <Header />
      <div className="product-page">
        <ProductHeroBanner />
        <ProductFilterBar 
          selectedFilters={selectedFilters}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
        <ProductGrid 
          selectedFilters={selectedFilters}
          sortBy={sortBy}
        />
      </div>
    </>
  );
};

export default ProductPage; 