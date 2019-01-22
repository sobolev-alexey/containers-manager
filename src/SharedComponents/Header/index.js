import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';
import updateStep from '../../utils/cookie';
import { logout } from '../../store/user/actions';
import { reset } from '../../store/project/actions';
import logoWhiteHorizontal from '../../assets/images/iota-horizontal-white.svg';
import '../../assets/scss/header.scss';

const CallToAction = ({ logout, reset, user }) => (
  <Col xs={4} className="cta">
    <div className="header-cta-wrapper">
      <Row>
        <Col xs={5}>
          <h4>
            User Role
          </h4>
          {
            !isEmpty(user) ? (
              <span>
                {upperFirst(user.role)}
              </span>
            ) : (
              <span>
                Logged out
              </span>
            )
          }
        </Col>
        <Col xs={7} className="button-wrapper">
          {
            !isEmpty(user) ? (
              <button className="button primary logout-cta" onClick={logout}>
                Log out
              </button>
            ) : (
              <button className="button secondary reset-cta" onClick={reset}>
                Reset demo
              </button>
            )
          }
        </Col>
      </Row>
    </div>
  </Col>
);

class Header extends Component {
  logout = () => {
    const { cookies, history, logout } = this.props;

    logout();
    updateStep(cookies, 9);
    updateStep(cookies, 13);
    updateStep(cookies, 19);

    if (Number(cookies.get('tourStep')) === 24) {
      cookies.remove('tourStep');
      cookies.remove('containerId');
      history.push('/tour');
    } else {
      history.push('/login');
    }
  };

  reset = () => {
    const { cookies, reset } = this.props;
    cookies.remove('tourStep');
    cookies.remove('containerId');
    reset();
    window.location.reload();
  };

  render() {
    const { children, className, ctaEnabled = false, user } = this.props;
    return (
      <header className={className}>
        <Row>
          <Col xs={12} className="d-flex justify-content-between align-items-start">
            <Col xs={4}>
              <Link to="/">
                <img className="logo" src={logoWhiteHorizontal} alt="IOTA" />
              </Link>
            </Col>
            { children }
            { ctaEnabled ? <CallToAction logout={this.logout} reset={this.reset} user={user} /> : null }
          </Col>
        </Row>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  reset: () => dispatch(reset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withCookies(Header)));
