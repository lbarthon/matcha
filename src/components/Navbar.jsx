import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../utils/allHOC';

class Navbar extends Component {

  componentWillMount() {
    console.log('mount navbar');
  }

  componentWillUpdate() {
    console.log('update navbar');
  }

  render() {
    const { locales } = this.props;
    const { logged } = this.props.currentUser;
    return (
      <header>
        <nav style={{ marginBottom:20 }}>
          <div className="nav-wrapper">
            <Link to="/" className="brand-logo"><i className="material-icons">insert_emoticon</i>Matcha</Link>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
            {logged === true &&
              <li><Link to="/logout">{locales.locale.nav.logout}</Link></li>
            }
            {logged === false &&
              <React.Fragment>
                <li><Link to="/register">{locales.locale.nav.register}</Link></li>
                <li><Link to="/login">{locales.locale.nav.login}</Link></li>
              </React.Fragment>
            }
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

export default withAllHOC(Navbar);
