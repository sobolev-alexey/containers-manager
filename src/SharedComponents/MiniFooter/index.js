import React from 'react';
import '../../assets/scss/footer.scss';

export default ({ children }) => (
  <footer className="footer-mini">
    <span className="contact">
      Email: <a href="mailto:contact@iota.org">contact@iota.org</a>
    </span>
    <span>
      © 2018 <a href="https://iota.org">IOTA Foundation</a> — <a href="https://www.iota.org/research/privacy-policy">Privacy Policy</a>
    </span>
  </footer>
);
