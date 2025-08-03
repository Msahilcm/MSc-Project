import React, { useState, useRef } from 'react';
import Header from './Header';
import './UserProfilePage.css';
import { useNavigate } from 'react-router-dom';
import userIcon from '../assets/user(1).png';

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
                <li key={item} className={item === 'PROFILE' ? 'active' : ''}>{item}</li>
              ) : (
                <li key={idx} className="profile-sidebar-spacer"></li>
              )
            )}
          </ul>
        </aside>
        <main className="profile-main">
          <div className="profile-main-content">
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
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfilePage; 