import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from "react-router-dom";
import { logout } from '../../store/user/actions';
import Logo from '../Logo';
import '../../assets/scss/header.scss';

class Header extends Component {
  logout = () => {
    this.props.logout();
    this.props.history.push('/login');
  };

  render() {
    return (
      <div className="header">
        <span className="header__logo">
          <Link to="/list">
            <Logo />
          </Link>
        </span>
        {this.props.children}
        <span className="header__logout" role="button" onClick={this.logout}>
          Logout
        </span>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(
  null,
  mapDispatchToProps
)(withRouter(Header));
