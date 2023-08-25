import React from 'react';
import ThemeToggleButton from '../ThemeToggleButton/ThemeToggleButton';
import './Header.css';

function Header() {
  
  return (
    <div className="header-container">
      <h1>My Finance Dashboard</h1>
      <ThemeToggleButton/>
    </div>
  );
}

export default Header;
