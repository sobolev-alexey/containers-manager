import React from 'react';
import { Link } from "react-router-dom";
import logo from '../logo.svg';

class Home extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            HOME
          </p>

          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>

        </header>
      </div>
    );
  }
}

export default Home;
