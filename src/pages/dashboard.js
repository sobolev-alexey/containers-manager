import React from 'react';
import { Link } from "react-router-dom";

class Dashboard extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Dashboard
          </p>

          <ul>
            <li>
              <Link to="/">Home</Link>
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

export default Dashboard;
