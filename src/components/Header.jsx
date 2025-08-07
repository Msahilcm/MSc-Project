import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import fwLogo from '../assets/logo.png';
import HamburgerMenu from './HamburgerMenu';
import { Link } from 'react-router-dom';
import userIcon from '../assets/user(1).png';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const [whiteText, setWhiteText] = useState(false);
  const headerRef = useRef(null);
  const { getCartCount } = useCart();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const profileImage = user.profile_image 
    ? `http://localhost:5000/uploads/${user.profile_image}` 
    : userIcon;

  useEffect(() => {
    const header = headerRef.current;
    const darkSections = Array.from(document.querySelectorAll('.dark-section'));
    if (!header || darkSections.length === 0) return;

    let isIntersectingAny = false;
    const observer = new window.IntersectionObserver(
      (entries) => {
        isIntersectingAny = entries.some(entry => entry.isIntersecting);
        setWhiteText(isIntersectingAny);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
      }
    );
    darkSections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className={`header${whiteText ? ' header--white-text' : ''}`}>
      <div className="header__row">
        <div className="header__left">
          <HamburgerMenu />
          <Link to="/">
            <img src={fwLogo} alt="FW Logo" className="header__logo-img" />
          </Link>
        </div>
        <div className="header__right">
          <div className="header__search">
            <input type="text" placeholder="SEARCH" />
          </div>
          <nav className="header__nav--top">
            {localStorage.getItem('token') ? (
              <Link to="/profile" className="header__user-icon" style={{ textDecoration: 'none' }}>
                <img src={profileImage} alt="User" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
              </Link>
            ) : (
              <Link to="/login">LOGIN</Link>
            )}
            <a href="#help">HELP</a>
            <Link to="/cart" className="header__cart-link">
              FURNI BAG [{getCartCount()}]
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 