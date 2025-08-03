import React from 'react';
import Header from './Header';
import './LoginPage.css';
import loginVid1 from '../assets/video/4065224-uhd_2160_4096_25fps.mp4';
import loginVid2 from '../assets/video/4144242-hd_1080_1920_25fps.mp4';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="login-page-container">
        <div className="login-left">
          <h2>ENJOY THE BEST EXPERIENCE</h2>
          <p>Log in to enjoy a personalised experience and access all our services.</p>
          <button className="login-btn" onClick={() => navigate('/login/form')}>LOG IN</button>
          <button className="register-btn" onClick={() => navigate('/register')}>REGISTER</button>
        </div>
        <div className="login-right">
          <video src={loginVid1} className="login-img" autoPlay loop muted playsInline />
          <video src={loginVid2} className="login-img" autoPlay loop muted playsInline />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
