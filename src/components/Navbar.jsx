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
    .catch(error => {
      console.log(error);
    })

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
              <React.Fragment>
                <li><Link to="/update">{locales.locale.nav.update}</Link></li>
                <li><a onClick={this.handleLogout}>{locales.locale.nav.logout}</a></li>
              </React.Fragment>
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
