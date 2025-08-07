import React from 'react';
import './Notification.css';

const Notification = ({ message, type = 'success', onClose, show }) => {
  if (!show) return null;

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {type === 'success' ? '✓' : '✗'}
        </div>
        <div className="notification-message">{message}</div>
        <button className="notification-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification; 