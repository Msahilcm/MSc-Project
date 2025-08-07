import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import fwLogo from '../assets/logo.png';
import video1 from '../assets/video/4505482-uhd_4096_2160_25fps.mp4';
import Notification from './Notification';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setNotificationMessage('Password reset email sent successfully!');
        setNotificationType('success');
        setShowNotification(true);
        // Show success popup
        setTimeout(() => {
          navigate('/login/form');
        }, 3000);
      } else {
        setError(data.message || 'Failed to send reset email');
        setNotificationMessage(data.message || 'Failed to send reset email');
        setNotificationType('error');
        setShowNotification(true);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setNotificationMessage('Network error. Please try again.');
      setNotificationType('error');
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgotpassword-page-container">
      <Notification 
        show={showNotification}
        message={notificationMessage}
        type={notificationType}
        onClose={() => setShowNotification(false)}
      />
      <div className="forgotpassword-left">
        <img src={fwLogo} alt="Logo" className="forgotpassword-logo" />
        <h2>RESET PASSWORD</h2>
        <p className="forgotpassword-description">
          We will send you an email with instructions on how to recover it
        </p>
        
        {success ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Email Sent Successfully!</h3>
            <p>Please check your email for password reset instructions.</p>
            <p>Redirecting to login page...</p>
          </div>
        ) : (
          <form className="forgotpassword-form" onSubmit={handleSubmit}>
            <label htmlFor="email">E-MAIL</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="continue-btn" disabled={loading}>
              {loading ? 'SENDING...' : 'CONTINUE'}
            </button>
            <button 
              type="button" 
              className="back-btn" 
              onClick={() => navigate('/login/form')}
            >
              BACK TO LOGIN
            </button>
          </form>
        )}
      </div>
      <div className="forgotpassword-right">
        <video src={video1} className="forgotpassword-img" autoPlay loop muted playsInline />
      </div>
    </div>
  );
};

export default ForgotPassword; 