import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import './Topbar.css';

const Topbar = () => {
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    if (path === '/journal') return 'Trade Log';
    if (path === '/gallery') return 'Chart Gallery';
    if (path === '/analytics') return 'Performance Analytics';
    if (path === '/profile') return 'Account Settings';
    return 'Dashboard';
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="topbar-center">
        <div className="session-indicator">
          <span className="pulse-dot"></span>
          <span className="session-text">London Session Open</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="account-summary">
          <span className="label">Live Balance</span>
          <span className="value">${profile?.balance?.toLocaleString() || '54,210'}</span>
        </div>
        <button className="icon-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
