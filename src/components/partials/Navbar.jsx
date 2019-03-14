import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css';
import { alert } from '../../utils/alert';

class Navbar extends Component {

  handleLogout = () => {
    const { socket } = this.props;
    const { getCurrentUser, id } = this.props.currentUser;
    fetch('/api/logout', {
      headers: {'CSRF-Token' : localStorage.getItem('csrf')}
    }).then(response => {
      if (response.ok) {
        socket.emit('logout');
        getCurrentUser();
      } else console.error(new Error(response.statusText));
    });
  }

  initNavbar = () => {
    let elem = document.querySelector('.sidenav.sidenav-main');
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
    let chat = document.querySelector('.window-chat');
    if (chat.style.display == 'none')
      chat.style.display = 'block';
    else
      chat.style.display = 'none';
  }

  componentWillMount() {
    const { socket } = this.props;
    const { id } = this.props.currentUser;
  }

  componentDidMount() {
    this.initNavbar();
    this.initDropdown();
  }

  render() {
    const { locales } = this.props;
    const { logged, username } = this.props.currentUser;
    const { notifs } = this.props;
    return (
      <header>
        <ul id="dropdown1" className="dropdown-content">
          <li><Link to="/update">{locales.locale.nav.update}</Link></li>
          <li><Link to="/upload">{locales.locale.nav.upload}</Link></li>
          <li><Link to={'/user/' + this.props.currentUser.id}>{locales.locale.nav.profile}</Link></li>
        </ul>
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper">
              <Link to="/" className="brand-logo ml-10">Matcha</Link>
              <a href="#" data-target="sidenav" className="sidenav-trigger"><i className="material-icons">menu</i></a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li style={{display: logged ? 'block' : 'none' }}><a className="dropdown-trigger" data-target="dropdown1">{username}<i className="material-icons right">arrow_drop_down</i></a></li>
                {logged === true &&
                  <React.Fragment>
                    <li><Link to="/match">Match</Link></li>
                    <li>
                      <Link to="/notifications" style={{position: 'relative'}}>
                        <i className="material-icons">notifications_none</i>
                        {notifs.count != 0 && <div className="navbar-new">{notifs.count}</div>}
                      </Link>
                    </li>
                    <li><a onClick={this.toggleChat}><i className="material-icons">chat_bubble_outline</i></a></li>
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
        </div>
        <ul className="sidenav sidenav-main" id="sidenav">
          {logged === true &&
            <React.Fragment>
              <li><Link to="/notifications" style={{position: 'relative'}}>
              {notifs.count != 0 && <div className="navbar-new" style={{right: '20px'}}>{notifs.count}</div>}
              <i className="material-icons">notifications_none</i>
              Notifications</Link></li>
              <li><Link to="/chat"><i className="material-icons">chat_bubble_outline</i>Chat</Link></li>
              <li><Link to="/match">Match</Link></li>
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
