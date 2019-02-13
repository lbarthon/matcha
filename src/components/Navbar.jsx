import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withLocalesHOC } from '../utils/Locales';

class Navbar extends Component {
  render() {
    const { locales } = this.props;
    return(
      <header>
        <nav style={{ marginBottom:20 }}>
          <div className="nav-wrapper">
            <Link to="/" className="brand-logo"><i className="material-icons">insert_emoticon</i>Matcha</Link>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><Link to="/logout">{locales.locale.nav.logout}</Link></li>
              <li><Link to="/register">{locales.locale.nav.register}</Link></li>
              <li><Link to="/login">{locales.locale.nav.login}</Link></li>
              <li><a className="waves-effect waves-light btn" onClick={() => locales.toggleLanguage()}>{locales.text}</a></li>
            </ul>
          </div>
        </nav>
        <ul className="sidenav" id="mobile-demo">
          <li><Link to="/logout">{locales.locale.nav.logout}</Link></li>
          <li><Link to="/register">{locales.locale.nav.register}</Link></li>
          <li><Link to="/login">{locales.locale.nav.login}</Link></li>
        </ul>
      </header>
    );
  }
}

export default withLocalesHOC(Navbar);
