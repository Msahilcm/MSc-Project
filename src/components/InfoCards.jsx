import React from 'react';
import './InfoCards.css';
import giftCardImg from '../assets/giftcard.jpg'; 
import storeImg from '../assets/sofa/sofa3.jpg'; 
import appImg from '../assets/logo.png'; 

const InfoCards = () => (
  <section className="info-cards-section dark-section">
    <div className="info-cards-container">
      {/* Gift Cards */}
      <div className="info-card">
        <h2>GIFT CARDS</h2>
        <img src={giftCardImg} alt="Gift Card" className="info-card-img" />
        <div className="info-card-price">£5 - £300</div>
        <p>The ultimate gift card is the only gift card you need. Available in over 500 stores across the country, it's the perfect gift.</p>
        <a href="#" className="info-card-link">Buy gift cards</a>
      </div>
      {/* Our Stores */}
      <div className="info-card">
        <h2>OUR STORES</h2>
        <img src={storeImg} alt="Our Stores" className="info-card-img" />
        <p>Find your local store, view opening hours and find out where you can get free delivery to collect your order from!<br /><br />Just enter your postcode below to find your nearest store.</p>
        <div className="postcode-form">
          <input type="text" placeholder="ENTER POSTCODE..." />
          <button>GO</button>
        </div>
      </div>
      {/* Download Our Apps */}
      <div className="info-card">
        <h2>DOWNLOAD OUR APPS</h2>
        <img src={appImg} alt="App Preview" className="info-card-img app-img" />
        <p>Shop 24/7 using the app. Access exclusive offers & shop the very latest products on the move.</p>
        <div className="app-buttons">
          <a href="#" className="app-store-btn">Download on the App Store</a>
          <a href="#" className="google-play-btn">Get it on Google Play</a>
        </div>
      </div>
    </div>
  </section>
);

export default InfoCards; 