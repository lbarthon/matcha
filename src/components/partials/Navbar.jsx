import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css';

class Navbar extends Component {

  handleLogout = () => {
    const { getCurrentUser } = this.props.currentUser;
    fetch('/api/logout').then(response => {
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
      edge: 'left',
      inDuration: 250
    });
  }

  initDropdown = () => {
    let elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {
      constrainWidth: false
    });
  }

  toggleChat = () => {
    let chat = document.querySelector('.chat');
    if (chat.style.display == 'none')
      chat.style.display = 'block';
    else
      chat.style.display = 'none';
  }

  getNotifications = () => {
    //todo
  }

  componentWillMount() {
    const { socket } = this.props;
    const { id } = this.props.currentUser;
    socket.emit('join', {id: id});
    socket.on('new_msg', data => {
      console.log('Vous avez recu un nouveau message !', data);
    });
  }

  componentDidMount() {
    this.initNavbar();
    this.initDropdown();
  }

  render() {
    const { locales } = this.props;
    const { logged, username } = this.props.currentUser;
    return (
      <header>
        <ul id="dropdown1" class="dropdown-content">
          <li><Link to="/update">{locales.locale.nav.update}</Link></li>
          <li><Link to="/upload">{locales.locale.nav.upload}</Link></li>
          <li class="divider"></li>
          <li><a onClick={this.handleLogout}>{locales.locale.nav.logout}</a></li>
        </ul>
        <nav style={{ marginBottom:20 }}>
          <div className="nav-wrapper">
            <Link to="/" className="brand-logo ml-10">Matcha</Link>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {logged === true &&
                <React.Fragment>
                  <li><Link to="/notifications"><i className="material-icons">notifications_none</i></Link></li>
                  <li><a onClick={this.toggleChat}><i className="material-icons">message</i></a></li>
                </React.Fragment>
              }
              <li style={{display: logged ? 'block' : 'none' }}><a class="dropdown-trigger" data-target="dropdown1">{username}<i class="material-icons right">arrow_drop_down</i></a></li>
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
              <li><Link to="/notifications"><i className="material-icons">notifications_none</i>Notifications</Link></li>
              <li><a onClick={this.toggleChat}><i className="material-icons">message</i></a></li>
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
