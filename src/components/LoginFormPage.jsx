import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginFormPage.css';
import fwLogo from '../assets/logo.png';
import video1 from '../assets/video/4505482-uhd_4096_2160_25fps.mp4';

const LoginFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Check if this is an admin user
        if (data.data.user.isAdmin) {
          // Store admin data
          localStorage.setItem('adminToken', data.data.token);
          localStorage.setItem('adminUser', JSON.stringify(data.data.user));
          navigate('/admin');
        } else {
          // Store regular user data
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          navigate('/');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginform-page-container">
      <div className="loginform-left">
        <img src={fwLogo} alt="Logo" className="loginform-logo" />
        <h2>LOG IN</h2>
        <form className="loginform-form" onSubmit={handleSubmit}>
          <label htmlFor="email">EMAIL</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            autoComplete="username"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="password">PASSWORD</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <div className="forgot-password">Have you forgotten your password?</div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>
          <button type="button" className="register-btn" onClick={() => navigate('/register')}>
            REGISTER
          </button>
        </form>
      </div>
      <div className="loginform-right">
        <video src={video1} className="loginform-img" autoPlay loop muted playsInline />
      </div>
    </div>
  );
};

export default LoginFormPage;
 