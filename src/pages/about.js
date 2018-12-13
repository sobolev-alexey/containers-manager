import React from 'react';
import { Link } from "react-router-dom";

class About extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            About
          </p>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>

        </header>
      </div>
    );
  }
}

export default About;
