import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

const ComingSoonPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const title = params.get('title') || 'Coming Soon';

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 900, margin: '140px auto 0', padding: '0 16px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: 8 }}>{title}</h1>
        <p style={{ color: '#555' }}>This section is coming soon. Stay tuned for updates.</p>
        <div style={{ marginTop: 16 }}>
          <button onClick={() => navigate('/products')} className="btn btn-primary">Browse Products</button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;

