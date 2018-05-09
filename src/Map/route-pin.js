import React, { PureComponent } from 'react';
import styles from './styles.css';

export default class RoutePin extends PureComponent {
  render() {
    const { size = 20 } = this.props;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size * 1.6}
        viewBox="0 0 100 100"
        className={styles.routePin}
      >
        <circle cx="50" cy="50" r="40" style={{ fill: '#18807b' }} />
      </svg>
    );
  }
}
