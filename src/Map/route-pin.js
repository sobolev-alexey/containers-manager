import React, { PureComponent } from 'react';
import styles from './styles.css';

export default class RoutePin extends PureComponent {
  render() {
    const { size = 15, onClick, color = '#18807b' } = this.props;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox="0 0 100 100"
        onClick={() => onClick()}
        className={styles.routePin}
      >
        <circle cx="50" cy="50" r="40" style={{ fill: color }} />
      </svg>
    );
  }
}
