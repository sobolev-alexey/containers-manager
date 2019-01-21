import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/scss/footer.scss';

export default ({ children }) => (
  <footer className="footer-mini">
    <span>
      Email: <a href="mailto:contact@iota.org">contact@iota.org</a>
    </span>
    <span>
      <Link to="/tour">Finish demo? Learn more about IOTA Trade</Link>
    </span>
    <span className="copyright">
      © 2018 <a href="https://iota.org">IOTA Foundation</a> — <a href="https://www.iota.org/research/privacy-policy">Privacy Policy</a>
    </span>
  </footer>
);
