import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import logoWhiteHorizontal from '../assets/images/iota-horizontal-white.svg';
import useCasesPlaceholder from '../assets/images/intro/use-cases-placeholder.png';
import '../assets/scss/intro.scss';

class IntroPage extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="heading-image d-flex justify-content-center align-items-center">
          <div className="overlay d-flex flex-column">
            <div className="head-2">International shipping is broken</div>
            <div className="sep">&nbsp;</div>
            <div className="sub-1">
              Today's trade is still based on paper documents and antiquated processes.
            </div>
            <div className="sep">&nbsp;</div>
            <div className="sub-1">
              IOTA is set to radically transform international trade and supply chains, improving
              visibility, control and reducing overheads.
            </div>
            <div className="sub-1">
              <Link to="/login" className="button">
                Learn how
              </Link>
            </div>
          </div>
        </div>
        <header>
          <Row>
            <Col xs={12} className="d-flex justify-content-between align-items-start">
              <Link to="/">
                <img className="logo" src={logoWhiteHorizontal} alt="IOTA" />
              </Link>
              <nav className="d-flex justify-content-end">
                <ul>
                  <li>
                    <Link to="/login">
                      Try the demo
                    </Link>
                  </li>
                </ul>
              </nav>
            </Col>
          </Row>
        </header>
        <div className="content">
          <div className="alternate extra-padding" id="usecases">
            <Row>
              <Col xs={12}>
                <h2 className="d-flex justify-content-responsive">Use cases for the technology</h2>
              </Col>
              <Col xs={12} sm={6} className="d-flex flex-column justify-content-center">
                <h1 className="text-responsive-align">
                  Secure, private exchange of sensitive product information and specifications
                </h1>
                <p className="text-responsive-align">
                  Using IOTA Masked Authenticated Messaging (MAM), all data is securely encrypted,
                  preventing unauthorized parties from accessing your important data.
                </p>
              </Col>
              <Col xs={12} sm={6} className="d-flex flex-column justify-content-center">
                <img
                  className="img-fluid use-cases-1"
                  src={useCasesPlaceholder}
                  alt="Use Cases 1"
                />
              </Col>
              <Col
                xs={12}
                sm={6}
                className="d-flex flex-column justify-content-center hidden-xs-down"
              >
                <img
                  className="img-fluid use-cases-2"
                  src={useCasesPlaceholder}
                  alt="Use Cases 2"
                />
              </Col>
              <Col xs={12} sm={6} className="d-flex flex-column justify-content-center">
                <h1 className="text-responsive-align-alt">
                  Compatibility across product groups and processes
                </h1>
                <p className="text-responsive-align-alt">
                  eCl@ss catalogue descriptions reduce semantic errors and provide clear data
                  structure in a M2M environment. Machines can identify and understand themselves or
                  a counterpart’s capabilities.
                </p>
              </Col>
              <Col
                xs={12}
                sm={6}
                className="d-flex flex-column justify-content-center hidden-sm-up"
              >
                <img
                  className="img-fluid use-cases-2"
                  src={useCasesPlaceholder}
                  alt="Use Cases 2"
                />
              </Col>
              <Col xs={12} sm={6} className="d-flex flex-column justify-content-center">
                <h1 className="text-responsive-align">
                  Translation support for a borderless digital economy
                </h1>
                <p className="text-responsive-align">
                  eCl@ss enables seamless support for over 16 languages providing reliable data
                  exchange without ambiguity or translation errors.
                </p>
              </Col>
              <Col xs={12} sm={6} className="d-flex flex-column justify-content-center">
                <img
                  className="img-fluid use-cases-3"
                  src={useCasesPlaceholder}
                  alt="Use Cases 3"
                />
              </Col>
              <Col
                xs={12}
                sm={6}
                className="d-flex flex-column justify-content-center hidden-xs-down"
              >
                <img
                  className="img-fluid use-cases-4"
                  src={useCasesPlaceholder}
                  alt="Use Cases 4"
                />
              </Col>
              <Col xs={12} sm={6} className="d-flex flex-column justify-content-center">
                <h1 className="text-responsive-align-alt">
                  Data consistency for flexible and automated supply chains
                </h1>
                <p className="text-responsive-align-alt">
                  The IOTA Tangle is a distributed ledger technology (DLT), recording data exchange
                  in a secure and immutable log. A tamper-proof, single source of truth.
                </p>
              </Col>
              <Col
                xs={12}
                sm={6}
                className="d-flex flex-column justify-content-center hidden-sm-up"
              >
                <img
                  className="img-fluid use-cases-4"
                  src={useCasesPlaceholder}
                  alt="Use Cases 4"
                />
              </Col>
            </Row>
          </div>
          <div className="inter" id="tryit">
            <Row className="row-header">
              <Col xs={12}>
                <h2 className="d-flex justify-content-responsive">
                  Try it with a live transaction
                </h2>
              </Col>
              <Col xs={12} sm={6} className="d-flex flex-column justify-content-center">
                <h1 className="text-responsive-align">
                  Secure, private exchange of sensitive product information and specifications
                </h1>
                <p className="text-responsive-align">
                  Using IOTA Masked Authenticated Messaging (MAM), all data is securely encrypted,
                  preventing unauthorized parties from accessing your important data.
                </p>
              </Col>
              <Col xs={12} sm={6} className="d-flex flex-column justify-content-center">
                <img
                  className="img-fluid use-cases-1"
                  src={useCasesPlaceholder}
                  alt="Use Cases 1"
                />
              </Col>
              <Col
                xs={12}
                sm={6}
                className="d-flex flex-column justify-content-center hidden-xs-down"
              >
                <img
                  className="img-fluid use-cases-2"
                  src={useCasesPlaceholder}
                  alt="Use Cases 2"
                />
              </Col>
              <Col xs={12} sm={6} className="d-flex flex-column justify-content-center">
                <h1 className="text-responsive-align-alt">
                  Compatibility across product groups and processes
                </h1>
                <p className="text-responsive-align-alt">
                  eCl@ss catalogue descriptions reduce semantic errors and provide clear data
                  structure in a M2M environment. Machines can identify and understand themselves or
                  a counterpart’s capabilities.
                </p>
              </Col>
            </Row>
          </div>
        </div>
        <footer>
          <Row>
            <Col>
              <div className="footer-heading">This Site</div>
              <a href="#introduction">Introduction</a>
              <br />
              <a href="#usecases">The use cases</a>
              <br />
              <a href="#tryit">Try it for yourself</a>
            </Col>
            <Col>
              <div className="footer-heading">The Foundation</div>
              <a href="https://www.iota.org/the-foundation/our-vision">Our Vision</a>
              <br />
              <a href="https://www.iota.org/the-foundation/the-iota-foundation">
                The IOTA Foundation
              </a>
              <br />
              <a href="https://www.iota.org/the-foundation/team">Meet the Team</a>
              <br />
              <a href="https://www.iota.org/the-foundation/work-at-the-iota-foundation">
                Work at the IOTA Foundation
              </a>
            </Col>
            <Col>
              <div className="footer-heading">Verticals</div>
              <a href="https://www.iota.org/verticals/mobility-automotive">
                Mobility &amp; Automotive
              </a>
              <br />
              <a href="https://www.iota.org/verticals/global-trade-supply-chains">
                Global Trade &amp; Supply Chains
              </a>
              <br />
              <a href="https://www.iota.org/verticals/ehealth">eHealth</a>
              <br />
              <a href="https://www.iota.org/verticals/smart-energy">Smart Energy</a>
            </Col>
            <Col>
              <div className="footer-heading">Research</div>
              <a href="https://www.iota.org/research/meet-the-tangle">Meet the Tangle</a>
              <br />
              <a href="https://www.iota.org/research/academic-papers">Academic Papers</a>
              <br />
              <a href="https://www.iota.org/research/roadmap">Research &amp; Development Roadmap</a>
            </Col>
          </Row>
          <Row>
            <Col className="footer-text-info">
              IOTA Foundation
              <br />
              c/o Nextland
              <br />
              Strassburgerstraße 55
              <br />
              10405 Berlin
              <br />
              Germany
            </Col>
            <Col className="footer-text-info">
              &copy; 2018 IOTA Foundation - Privacy Policy
              <br />
              Email: contact@iota.org
              <br />
              Board of Directors: Dominik Schiener, David Sønstebø, Ralf Rottmann, Serguei Popov
              &amp; Sergey Ivancheglo
              <br />
              ID/Company No.: 3416/1234/2
              <br />
              EU public ID number in the EU Transparency Register: 500027331119-04
            </Col>
          </Row>
        </footer>
      </React.Fragment>
    );
  }
}

export default IntroPage;
