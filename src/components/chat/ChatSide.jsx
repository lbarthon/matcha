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
    return (
      <React.Fragment>
        <ul id="chatside" class="sidenav">
          {this.props.rooms.map(room => {
            return <li><a class="waves-effect" onClick={() => this.props.changeRoom(room.id)}>{room.user.username}</a></li>
          })}
        </ul>
        <a href="#" data-target="chatside" className="sidenav-trigger"><i className="material-icons">menu</i></a>
      </React.Fragment>
    )
  }
}

export default withAllHOC(ChatSide);
