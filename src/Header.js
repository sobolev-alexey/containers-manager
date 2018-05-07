import React from 'react';
import Logo from './Logo';
import './Header.css';

export default ({ name }) => (
  <div className="header">
    <Logo />
    <p>
      Welcome to container tracking,<br />
      {name}
    </p>
    <div />
  </div>
);
