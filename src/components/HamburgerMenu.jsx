import React, { useState, useEffect } from 'react';
import './HamburgerMenu.css';
import fwLogo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  'LIVING ROOM',
  'BED ROOM',
  'KITCHEN',
  'HALLWAY',
  'OFFICE',
  '1ST ANNIVERSARY',
  'SALE',
  'GIFT CARD',
  'DOWNLOAD APP',
];

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button className="hamburger-icon" onClick={() => setOpen(true)} aria-label="Open menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      {open && (
        <>
          <div className="menu-overlay-bg" onClick={() => setOpen(false)} />
          <div className="menu-overlay">
            <button className="close-icon" onClick={() => setOpen(false)} aria-label="Close menu">
              <span></span>
              <span></span>
            </button>
            <img src={fwLogo} alt="FW Logo" className="menu-logo-overlay" />
            <nav className="menu-nav">
              {navLinks.map((link, idx) => (
                <a
                  href="#"
                  key={idx}
                  className={`menu-link${link === 'SALE' ? ' menu-link-sale' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    // Route to products with category filter when applicable
                    const categoryCandidates = ['LIVING ROOM','BED ROOM','KITCHEN','HALLWAY','OFFICE'];
                    const comingSoonCandidates = ['1ST ANNIVERSARY', 'GIFT CARD', 'DOWNLOAD APP'];
                    if (categoryCandidates.includes(link)) {
                      navigate(`/products?category=${encodeURIComponent(link)}`);
                    } else if (comingSoonCandidates.includes(link)) {
                      navigate(`/coming-soon?title=${encodeURIComponent(link)}`);
                    } else {
                      navigate('/products');
                    }
                    setOpen(false);
                  }}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default HamburgerMenu;
