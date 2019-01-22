import React from 'react';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../../assets/scss/footer.scss';

export default ({ children }) => (
  <footer className="footer-mini">
      <Col xs={12} sm={12} md={4} className="d-flex justify-content-start">
        <span>
          Email: <a href="mailto:contact@iota.org">contact@iota.org</a>
        </span>
      </Col>
      <Col xs={12} sm={12} md={4} className="d-flex justify-content-center">
        <span>
          <Link to="/tour">Finish demo? Learn more about IOTA & Trade</Link>
        </span>
      </Col>
      <Col xs={12} sm={12} md={4} className="d-flex justify-content-end">
        <span className="copyright">
          © 2018 <a href="https://iota.org">IOTA Foundation</a> — <a href="https://www.iota.org/research/privacy-policy">Privacy Policy</a>
        </span>
      </Col>
  </footer>
);
