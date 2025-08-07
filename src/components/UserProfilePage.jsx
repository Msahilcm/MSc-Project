import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import './UserProfilePage.css';
import { useNavigate } from 'react-router-dom';
import userIcon from '../assets/user(1).png';
import { favoriteAPI } from '../services/api';
import ProductCard from './ProductCard';

const menuItems = [
  'PURCHASES',
  'EXCHANGES AND RETURNS',
  'NOTIFICATIONS',
  'PAYMENT METHODS',
  'PROFILE',
  'SETTINGS',
  '',
  'FAVOURITES',
  'HELP',
  'DOWNLOAD APP',
];

const UserProfilePage = () => {
  const navigate = useNavigate();
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [profileImage, setProfileImage] = useState(user.profile_image ? `http://localhost:5000/uploads/${user.profile_image}` : userIcon);
  const fileInputRef = useRef();
  const [activeSection, setActiveSection] = useState('PROFILE');

  // Favorites state
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeSection === 'FAVOURITES') {
      fetchFavorites();
    }
    // eslint-disable-next-line
  }, [activeSection]);

  const fetchFavorites = async () => {
    try {
      setFavoritesLoading(true);
      setFavoritesError(null);
      const response = await favoriteAPI.getUserFavorites(token);
      if (response.success) {
        console.log('Favorites data:', response.data); // Debug log
        setFavorites(response.data || []);
      } else {
        setFavoritesError(response.message || 'Failed to fetch favorites');
      }
    } catch (error) {
      setFavoritesError('Error loading favorites');
      console.error('Error fetching favorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId) => {
    try {
      const response = await favoriteAPI.removeFromFavorites(productId, token);
      if (response.success) {
        setFavorites(prev => prev.filter(product => product.id !== productId));
      }
    } catch (error) {
      // Optionally show error
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        alert('Account deleted successfully.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
      } else {
        alert(data.message || 'Failed to delete account.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to upload a profile image.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        alert('Authentication failed. Please log in again.');
        return;
      }
      if (data.success && data.imageUrl) {
        const newImageUrl = `http://localhost:5000${data.imageUrl}`;
        setProfileImage(newImageUrl);
        // Update localStorage with new profile image
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        const updatedUser = { ...currentUser, profile_image: data.imageUrl.split('/').pop() };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Force header to re-render by triggering a page refresh
        window.location.reload();
      } else {
        alert(data.message || 'Failed to upload image.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  return (
    <>
      <Header />
      <div className="profile-page-container">
        <aside className="profile-sidebar">
          <ul>
            {menuItems.map((item, idx) =>
              item ? (
                <li
                  key={item}
                  className={activeSection === item ? 'active' : ''}
                  onClick={() => setActiveSection(item)}
                  style={{ cursor: 'pointer' }}
                >
                  {item}
                </li>
              ) : (
                <li key={idx} className="profile-sidebar-spacer"></li>
              )
            )}
          </ul>
        </aside>
        <main className="profile-main">
          <div className="profile-main-content">
            {activeSection === 'PROFILE' && (
              <>
                <div className="profile-user-name">{user.name?.toUpperCase()} {user.surname?.toUpperCase()}</div>
                <div className="profile-details-row-flex">
                  <div className="profile-details-zara">
                    <div className="profile-details-label">ADDRESSES</div>
                    <div className="profile-details-label">MY MEASUREMENTS</div>
                    <div className="profile-details-label">EMAIL</div>
                    <div className="profile-details-value">{user.email}</div>
                    <div className="profile-details-label">PHONE</div>
                    <div className="profile-details-value">{user.phone_prefix} {user.phone}</div>
                    <div className="profile-details-label">PASSWORD</div>
                    <div className="profile-details-value">••••••••••</div>
                  </div>
                  <div className="profile-user-avatar">
                    <img src={profileImage} alt="User" />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      onChange={handleProfileImageChange}
                    />
                    <button
                      className="profile-avatar-upload-btn"
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      Upload Profile Image
                    </button>
                  </div>
                </div>
                <button className="profile-signout-btn" onClick={handleSignOut}>SIGN OUT</button>
                <button className="profile-delete-btn" onClick={handleDeleteAccount}>DELETE ACCOUNT</button>
              </>
            )}
            {activeSection === 'FAVOURITES' && (
              <div className="favorites-container" style={{ marginTop: 0 }}>
                <div className="favorites-header">
                  <h1>My Favorites</h1>
                  <p>Your saved products</p>
                </div>
                {favoritesLoading ? (
                  <div className="loading-message">
                    <div className="spinner"></div>
                    <p>Loading your favorites...</p>
                  </div>
                ) : favoritesError ? (
                  <div className="error-message">
                    <p>{favoritesError}</p>
                    <button onClick={fetchFavorites} className="retry-btn">
                      Try Again
                    </button>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="empty-favorites">
                    <div className="empty-icon">♡</div>
                    <h2>No favorites yet</h2>
                    <p>Start adding products to your favorites to see them here</p>
                    <button 
                      onClick={() => navigate('/')} 
                      className="browse-btn"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="favorites-grid">
                    {favorites.map(product => (
                      <div key={product.id} className="favorite-item">
                        <ProductCard product={product} />
                        <button 
                          className="remove-favorite-btn"
                          onClick={() => handleRemoveFromFavorites(product.id)}
                          title="Remove from favorites"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfilePage; 