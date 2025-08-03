import React, { useState, useEffect } from 'react';
import './HamburgerMenu.css';
import fwLogo from '../assets/logo.png';

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
                <a href="#" key={idx} className={`menu-link${link === 'SALE' ? ' menu-link-sale' : ''}`}>{link}</a>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default HamburgerMenu;
