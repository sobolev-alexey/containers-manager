import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import logoWhiteHorizontal from '../../assets/images/iota-horizontal-white.svg';
import '../../assets/scss/mini-header.scss';

export default ({ children, className }) => (
  <header className={className}>
    <Row>
      <Col xs={12} className="d-flex justify-content-between align-items-start">
        <Col xs={4}>
          <Link to="/">
            <img className="logo" src={logoWhiteHorizontal} alt="IOTA" />
          </Link>
        </Col>
        { children }
      </Col>
    </Row>
  </header>
);
