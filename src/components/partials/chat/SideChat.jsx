import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../../utils/allHOC';
import M from 'materialize-css';

class SideChat extends Component {

  getRooms = () => {
    fetch('/api/chat/room')
  }

  render() {
    return (
      <div>
        <div className="chat-tab">
          <i class="tiny material-icons">keyboard_arrow_left</i>
          <div class="chat-tab-new">4</div>
          <div class="right">
            <b>Xavier Niel</b>
            <img src="http://lorempixel.com/400/400/" alt="Contact Person"/>
          </div>
        </div>
      </div>
    )
  }
}

export default withAllHOC(SideChat);
