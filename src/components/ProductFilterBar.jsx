import React from 'react';
import './ProductFilterBar.css';

const ProductFilterBar = ({ selectedFilters, sortBy, onFilterChange, onSortChange }) => {
  const filterOptions = {
    furniture: ['LIVING ROOM','BED ROOM','KITCHEN','HALLWAY','OFFICE',],
    price: ['Under $50', '$50-$100', '$100-$200', '$200-$500', 'Over $500'],
    review: ['4+ Stars', '3+ Stars', '2+ Stars', '1+ Stars'],
    color: ['Black', 'White', 'Brown', 'Gray', 'Beige', 'Blue', 'Red', 'Green'],
    material: ['Plastic', 'Metal', 'Leather', 'Fabric', 'Wood'],
    offer: ['Sale', 'New Arrival', 'Best Seller', 'Limited Time']
  };

  const sortOptions = [
    'Featured',
    'Price: Low to High',
    'Price: High to Low',
    'Rating: High to Low',
    'Newest First'
  ];

  return (
    <div className="product-filter-bar">
      <div className="filter-options">
        <select 
          value={selectedFilters.furniture}
          onChange={(e) => onFilterChange('headphoneType', e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Furniture</option>
          {filterOptions.furniture.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select 
          value={selectedFilters.price}
          onChange={(e) => onFilterChange('price', e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Price</option>
          {filterOptions.price.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select 
          value={selectedFilters.review}
          onChange={(e) => onFilterChange('review', e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Review</option>
          {filterOptions.review.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select 
          value={selectedFilters.color}
          onChange={(e) => onFilterChange('color', e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Color</option>
          {filterOptions.color.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select 
          value={selectedFilters.material}
          onChange={(e) => onFilterChange('material', e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Material</option>
          {filterOptions.material.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select 
          value={selectedFilters.offer}
          onChange={(e) => onFilterChange('offer', e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Offer</option>
          {filterOptions.offer.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <button className="all-filters-btn">
          <span>All Filters</span>
          <span className="filter-icon">⚙️</span>
        </button>
      </div>

      <div className="sort-section">
        <select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-dropdown"
        >
          <option value="">Sort by</option>
          {sortOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilterBar; 