import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css';

class ChatSide extends Component {

  initSidenav = () => {
    let elems = document.querySelectorAll('#chatside');
    console.log(elems);
    let instances = M.Sidenav.init(elems, {
      edge: 'left',
      inDuration: 250
    });
  }

  componentDidMount() {
    this.initSidenav();
  }

  render() {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        <ul id="chatside" class="sidenav">
          {this.props.rooms.map(room => {
            return (
              <li>
                <a className="waves-effect" onClick={() => this.props.changeRoom(room.id)}>
                  {room.user.username}
                  {room.unread > 0 && <span className="new badge red" data-badge-caption={locale.chat.new}>{room.unread}</span>}
                </a>
              </li>
            )
          })}
        </ul>
        <a href="#" data-target="chatside" className="sidenav-trigger"><i className="material-icons">menu</i></a>
      </React.Fragment>
    )
  }
}

export default withAllHOC(ChatSide);
