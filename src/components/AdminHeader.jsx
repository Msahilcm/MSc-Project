import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';
import fwLogo from '../assets/logo.png';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login/form');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-header-left">
          <img src={fwLogo} alt="FW Logo" className="admin-header-logo" />
        </div>
        <div className="admin-header-right">
          <button className="admin-logout-btn" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 