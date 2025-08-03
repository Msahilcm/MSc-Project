import React, { useState } from 'react';
import Header from './Header';
import ProductHeroBanner from './ProductHeroBanner';
import ProductFilterBar from './ProductFilterBar';
import ProductGrid from './ProductGrid';
import './ProductPage.css';

const ProductPage = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    headphoneType: '',
    price: '',
    review: '',
    color: '',
    material: '',
    offer: ''
  });
  const [sortBy, setSortBy] = useState('');

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