import React from 'react';
import Header from './Header';

const HelpPage = () => {
  return (
    <div>
      <Header />
      <div style={{ maxWidth: 900, margin: '140px auto 0', padding: '0 16px' }}>
        <h1>Help</h1>
        <p>Find answers to common questions or contact support.</p>
        <div style={{ marginTop: 16 }}>
          <h3>FAQs</h3>
          <ul>
            <li>How do I track my order? — View your orders in the Purchases tab under Profile.</li>
            <li>How do I return an item? — Use the Exchanges and Returns section (coming soon).</li>
            <li>How do I change my address? — Go to Profile and click Addresses to add or update an address.</li>
            <li>How do I change my password? — Visit Profile and use the change password option (coming soon).</li>
          </ul>
        </div>
        <div style={{ marginTop: 16 }}>
          <h3>Contact</h3>
          <p>Email: fw@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

