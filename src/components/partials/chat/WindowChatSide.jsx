import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../../utils/allHOC';
import M from 'materialize-css';

class SideChat extends Component {

  closeChat = () => {
    let chat = document.querySelector('.window-chat');
    chat.style.display = 'none';
  }

  render() {
    return (
      <div>
        <div className="window-chat-close"><i className="material-icons" onClick={this.closeChat}>close</i></div>
        <div className="window-chat-tabs">
          {this.props.rooms.map(room => {
            return (
              <div key={room.id} className="window-chat-tab" onClick={() => this.props.changeRoom(room.id)}>
                {this.props.active == room.id &&
                  <i className="material-icons">keyboard_arrow_left</i>
                }
                {room.unread > 0 &&
                  <div className="window-chat-tab-new">{room.unread}</div>
                }
                <div className="right">
                  <b>{room.user.username}</b>
                  <img src={room.user.pic != null ? '/pictures/user/' + room.user.pic : '/pictures/user/default.jpg'}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default withAllHOC(SideChat);
