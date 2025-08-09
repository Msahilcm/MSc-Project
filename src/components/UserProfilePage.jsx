import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import './UserProfilePage.css';
import { useNavigate } from 'react-router-dom';
import userIcon from '../assets/user(1).png';
import { favoriteAPI, orderAPI, addressAPI } from '../services/api';
import ProductCard from './ProductCard';

const menuItems = [
  'PURCHASES',
  'EXCHANGES AND RETURNS',
  'PAYMENT METHODS',
  'PROFILE',
  '',
  'FAVOURITES',
  'HELP',
  'DOWNLOAD APP',
];

const UserProfilePage = () => {
  const navigate = useNavigate();
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const lastCard = (() => { try { return JSON.parse(localStorage.getItem('lastCard') || 'null'); } catch { return null; } })();
  const [profileImage, setProfileImage] = useState(user.profile_image ? `http://localhost:5000/uploads/${user.profile_image}` : userIcon);
  const fileInputRef = useRef();
  const [activeSection, setActiveSection] = useState('PROFILE');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Favorites state
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);
  const token = localStorage.getItem('token');

  // Addresses state for Profile > ADDRESSES
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState(null);
  const [showAddresses, setShowAddresses] = useState(false); // legacy (no longer used for inline panel)
  const [isAddressesModalOpen, setIsAddressesModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    if (activeSection === 'FAVOURITES') {
      fetchFavorites();
    }
    if (activeSection === 'PURCHASES') {
      fetchOrders();
    }
    // addresses now fetched on modal open
    // eslint-disable-next-line
  }, [activeSection, showAddresses]);

  useEffect(() => {
    // Support deep linking from checkout
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && tab.toUpperCase() === 'PURCHASES') {
      setActiveSection('PURCHASES');
    }
  }, []);

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

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setOrders([]);
        return;
      }
      const response = await orderAPI.getUserOrders(token);
      if (response.success) {
        setOrders(response.data || []);
      } else {
        setOrdersError(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      setOrdersError('Error loading orders');
    } finally {
      setOrdersLoading(false);
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

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      setAddressesError(null);
      const token = localStorage.getItem('token');
      if (!token) { setAddresses([]); return; }
      const res = await addressAPI.list(token);
      if (res.success) {
        setAddresses(res.data || []);
      } else {
        setAddressesError(res.message || 'Failed to load addresses');
      }
    } catch (e) {
      setAddressesError('Error loading addresses');
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert('Please log in.'); return; }
    const a = newAddress;
    if (!a.fullName || !a.line1 || !a.city || !a.postalCode || !a.country) {
      alert('Please complete the required address fields.');
      return;
    }
    const res = await addressAPI.create({ ...a, isDefault: addresses.length === 0 }, token);
    if (res.success) {
      await fetchAddresses();
      setIsAddressModalOpen(false);
      setNewAddress({ fullName: '', line1: '', line2: '', city: '', postalCode: '', country: '', phone: '' });
    } else {
      alert(res.message || 'Failed to save address');
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
                    <div
                      className="profile-details-label"
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => { setIsAddressesModalOpen(true); fetchAddresses(); }}
                    >
                      ADDRESSES
                    </div>
                    {/* MY MEASUREMENTS removed by request */}
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
                {isAddressesModalOpen && (
                  <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content" style={{ background: '#fff', borderRadius: 10, padding: 20, width: '92%', maxWidth: 600 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>Your Addresses</h2>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn" onClick={() => setIsAddressModalOpen(true)}>Add Address</button>
                          <button className="btn" onClick={() => setIsAddressesModalOpen(false)}>Close</button>
                        </div>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        {addressesLoading ? (
                          <div className="loading-message"><div className="spinner"></div><p>Loading addresses...</p></div>
                        ) : addressesError ? (
                          <div className="error-message"><p>{addressesError}</p></div>
                        ) : addresses.length === 0 ? (
                          <div className="empty-favorites">
                            <div className="empty-icon">🏠</div>
                            <h2>No addresses yet</h2>
                            <p>Add your shipping address to speed up checkout</p>
                            <button className="browse-btn" onClick={() => setIsAddressModalOpen(true)}>Add Address</button>
                          </div>
                        ) : (
                          <div className="addresses-list" style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                            {addresses.map(addr => (
                              <div key={addr.id} className="address-card" style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <div style={{ fontWeight: 600 }}>{addr.fullName}</div>
                                  {addr.isDefault && <span style={{ fontSize: 12, color: '#1f6feb' }}>Default</span>}
                                </div>
                                <div style={{ marginTop: 4, color: '#444' }}>
                                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city} {addr.postalCode}, {addr.country}
                                </div>
                                {addr.phone && <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Phone: {addr.phone}</div>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <button className="profile-signout-btn" onClick={handleSignOut}>SIGN OUT</button>
                <button className="profile-delete-btn" onClick={handleDeleteAccount}>DELETE ACCOUNT</button>
              </>
            )}
            {activeSection === 'PURCHASES' && (
              <div className="purchases-container">
                <div className="favorites-header">
                  <h1>My Purchases</h1>
                  <p>Your recent orders</p>
                </div>
                {ordersLoading ? (
                  <div className="loading-message"><div className="spinner"></div><p>Loading your orders...</p></div>
                ) : ordersError ? (
                  <div className="error-message"><p>{ordersError}</p></div>
                ) : orders.length === 0 ? (
                  <div className="empty-favorites">
                    <div className="empty-icon">🧾</div>
                    <h2>No orders yet</h2>
                    <p>Orders you place will appear here</p>
                    <button onClick={() => navigate('/')} className="browse-btn">Shop Now</button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-row">
                          <div>
                            <div className="order-id">Order #{order.id}</div>
                            <div className="order-date">{new Date(order.created_at).toLocaleString()}</div>
                          </div>
                          <div className="order-status">{order.status}</div>
                        </div>
                        <div className="order-row">
                          <div className="order-item">{order.product_name} × {order.quantity}</div>
                          <div className="order-total">${Number(order.total_amount).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeSection === 'EXCHANGES AND RETURNS' && (
              <div className="coming-soon" style={{ padding: 20 }}>
                <h1>Exchanges and Returns</h1>
                <p>This section is coming soon. You will be able to view and manage your return requests here.</p>
              </div>
            )}
            {activeSection === 'PAYMENT METHODS' && (
              <div className="payment-methods" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h1>Payment Methods</h1>
                {!lastCard ? (
                  <p>No recent card on file. Your last used card (masked) will appear here after a card payment.</p>
                ) : (
                  <div className="card-preview" style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, maxWidth: 420 }}>
                    <div style={{ fontWeight: 600 }}>Last Used Card</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                      <span>{lastCard.brand} •••• {lastCard.last4}</span>
                      <span>{lastCard.expiry}</span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>Name: {lastCard.name}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button onClick={() => navigate('/checkout')} className="browse-btn">Use Different Card</button>
                      <button onClick={() => { try { localStorage.removeItem('lastCard'); window.location.reload(); } catch {} }} className="clear-card-btn">Remove</button>
                    </div>
                  </div>
                )}
              </div>
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
            {activeSection === 'HELP' && (
              <div className="help-section" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h1>Help</h1>
                <p>Find answers to common questions or contact support.</p>
                <div>
                  <h3>FAQs</h3>
                  <ul>
                    <li>How do I track my order? — View your orders in the Purchases tab.</li>
                    <li>How do I return an item? — Use the Exchanges and Returns section (coming soon).</li>
                    <li>How do I change my address? — Go to Profile and click Addresses to add or update an address.</li>
                    <li>How do I change my password? — Visit Profile and use the change password option (coming soon).</li>
                  </ul>
                </div>
                <div>
                  <h3>Contact</h3>
                  <p>Email: support@example.com</p>
                </div>
              </div>
            )}
            {activeSection === 'DOWNLOAD APP' && (
              <div className="coming-soon" style={{ padding: 20 }}>
                <h1>Download App</h1>
                <p>Mobile apps are coming soon. Stay tuned!</p>
              </div>
            )}
          </div>
        </main>
      </div>
      {isAddressModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: 10, padding: 20, width: '92%', maxWidth: 520 }}>
            <h2 style={{ marginTop: 0 }}>Add Address</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="form-input" name="fullName" placeholder="Full name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
              <input className="form-input" name="line1" placeholder="Address line 1" value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
              <input className="form-input" name="line2" placeholder="Address line 2 (optional)" value={newAddress.line2} onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input className="form-input" name="city" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                <input className="form-input" name="postalCode" placeholder="Postal code" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
              </div>
              <input className="form-input" name="country" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
              <input className="form-input" name="phone" placeholder="Phone (optional)" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
              <button type="button" className="btn" onClick={() => setIsAddressModalOpen(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSaveAddress}>Save Address</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfilePage; 