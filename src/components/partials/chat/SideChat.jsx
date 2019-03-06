import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../../utils/allHOC';
import M from 'materialize-css';

class SideChat extends Component {

  closeChat = () => {
    let chat = document.querySelector('.chat');
    chat.style.display = 'none';
  }

  render() {
    return (
      <div>
        <div className="chat-close"><i className="material-icons" onClick={this.closeChat}>close</i></div>
        {this.props.rooms.map(room => {
          return (
            <div className="chat-tab" onClick={() => this.props.getMessages(room.id)}>
              <i className="tiny material-icons">keyboard_arrow_left</i>
              <div className="chat-tab-new">4</div>
              <div className="right">
                <b>{room.user.username}</b>
                <img src={room.user.pic != null ? '/pictures/user/' + room.user.pic : '/pictures/user/default.jpg'}/>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default withAllHOC(SideChat);
