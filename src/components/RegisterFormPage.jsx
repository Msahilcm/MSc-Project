import React, { useState } from 'react';
import Header from './Header';
import './RegisterFormPage.css';
import registerImg from '../assets/register.mp4';
import { useNavigate } from 'react-router-dom';

const RegisterFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    phone_prefix: '+44',
    telephone: ''
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect to main page or dashboard
        navigate('/');
      } else {
        // Show all validation errors if present
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.map(e => e.msg).join(' | '));
        } else {
          setError(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="registerform-page-container">
        <div className="registerform-left">
          <h2>PERSONAL DETAILS</h2>
          <form className="registerform-form" onSubmit={handleSubmit}>
            <label htmlFor="email">E-MAIL</label>
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="name">NAME</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="surname">SURNAME</label>
            <input 
              type="text" 
              id="surname" 
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
            />
            <div className="registerform-phone-row">
              <div className="registerform-prefix">
                <label htmlFor="prefix">PREFIX</label>
                <input 
                  type="text" 
                  id="prefix" 
                  name="phone_prefix" 
                  value="+44" 
                  readOnly 
                />
              </div>
              <div className="registerform-telephone">
                <label htmlFor="telephone" style={{visibility:'hidden'}}>TELEPHONE</label>
                <input 
                  type="text" 
                  id="telephone" 
                  name="telephone" 
                  placeholder="TELEPHONE"
                  value={formData.telephone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="registerform-sms-info">We will send you an SMS to verify your phone number</div>
            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>
        <div className="registerform-right">
           <video src={registerImg} className="registerform-img" autoPlay loop muted playsInline />
        </div>
      </div>
    </>
  );
};

export default RegisterFormPage; 