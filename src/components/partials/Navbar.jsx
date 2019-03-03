import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css';
import io from 'socket.io-client';

class Navbar extends Component {

  componentWillMount() {
    console.log('mount navbar');
  }

  componentWillUpdate() {
    console.log('update navbar');
  }

  handleLogout = () => {
    const { getCurrentUser } = this.props.currentUser;
    fetch('/api/logout')
    .then(response => {
      if (response.ok) {
        getCurrentUser();
      } else {
        throw Error(response.statusText);
      }
    })
    .catch(error => { console.log(error); });
  }

  initNavbar = () => {
    let elem = document.querySelector(".sidenav");
    M.Sidenav.init(elem, {
      edge: "left",
      inDuration: 250
    });
  }

  componentWillMount() {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
      console.log('connected to ws', socket.connected);
    });
    socket.on('test', data => {
      console.log(data);
    });
  }

  componentDidMount() {
    this.initNavbar();
    const host = window.location.host;
  }

  render() {
    const { locales } = this.props;
    const { logged } = this.props.currentUser;
    return (
      <header>
        <nav style={{ marginBottom:20 }}>
          <div className="nav-wrapper">
            <Link to="/" className="brand-logo ml-10">Matcha</Link>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {logged === true &&
                <React.Fragment>
                  <li><Link to="/update">{locales.locale.nav.update}</Link></li>
                  <li><Link to="/upload">{locales.locale.nav.upload}</Link></li>
                  <li><a onClick={this.handleLogout}>{locales.locale.nav.logout}</a></li>
                </React.Fragment>
              }
              {logged === false &&
                <React.Fragment>
                  <li><Link to="/register">{locales.locale.nav.register}</Link></li>
                  <li><Link to="/login">{locales.locale.nav.login}</Link></li>
                </React.Fragment>
              }
              <li><a className="waves-effect waves-light btn" onClick={locales.toggleLanguage}>{locales.text}</a></li>
            </ul>
          </div>
        </nav>
        <ul className="sidenav" id="mobile-demo">
          {logged === true &&
            <React.Fragment>
              <li><Link to="/update">{locales.locale.nav.update}</Link></li>
              <li><Link to="/upload">{locales.locale.nav.upload}</Link></li>
              <li><a onClick={this.handleLogout}>{locales.locale.nav.logout}</a></li>
            </React.Fragment>
          }
          {logged === false &&
            <React.Fragment>
              <li><Link to="/register">{locales.locale.nav.register}</Link></li>
              <li><Link to="/login">{locales.locale.nav.login}</Link></li>
            </React.Fragment>
          }
          <li><a className="waves-effect waves-light btn" onClick={locales.toggleLanguage}>{locales.text}</a></li>
        </ul>
      </header>
    );
  }
}

export default withAllHOC(Navbar);
