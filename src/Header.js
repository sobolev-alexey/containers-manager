import React from 'react';
import Logo from './Logo';
import './Header.css';

export default ({ children }) => (
  <div className="header">
    <Logo />
    {children}
  </div>
);
