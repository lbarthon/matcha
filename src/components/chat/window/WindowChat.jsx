import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../../utils/allHOC';
import M from 'materialize-css';
import WindowChatSide from './WindowChatSide'
import '../../../css/windowchat.css'
import { alert } from '../../../utils/alert';
import req from '../../../utils/req';

class Chat extends Component {

  state = {
    rooms: [],
    messages: [],
    room : {
      id: undefined,
      user : {
        username: '',
        pic: null
      }
    },
    message: ''
  }

  setRead = (roomId) => {
    const { rooms } = this.state;
    req('/api/chat/message/read/' + roomId)
    .then(res => {
      let copy = rooms.slice();
      copy.map(room => {
        if (room.id == roomId)
          room.unread = 0;
      });
      this.setState({rooms: copy});
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  changeRoom = (roomId) => {
    this.setState({messages: []});
    this.getMessages(roomId);
  }

  scrollDown = () => {
    let chat = document.querySelector('.window-chat-room-body');
    chat.scrollTop = chat.scrollHeight;
  }

  getMessages = (roomId) => {
    this.state.rooms.map(room => { if (room.id == roomId) this.setState({room: room}) });
    req('/api/chat/message/' + roomId)
    .then(res => {
      this.setState({messages: res}, () => {
        this.setRead(roomId);
        this.scrollDown();
      });
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  addMessage = (fromId, message) => {
    let newMessage = {id_from: fromId, message: message}
    this.setState({
      messages : [
        ...this.state.messages,
        newMessage
      ]
    }, () => {this.scrollDown()})
  }

  handleSubmit = e => {
    e.preventDefault();
    const { id } = this.props.currentUser;
    const { socket } = this.props;
    const { message, room } = this.state;
    req('/api/chat/message', {message: message, roomId: room.id, toId: room.user.id})
    .then(res => {
      this.addMessage(id, message);
      this.setRead(room.id);
      this.setState({message: ''});
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
    document.querySelector('#message').value = '';
  }

  getRooms = () => {
    const { room, rooms } = this.state;
    req('/api/chat/room')
    .then(res => {
      this.setState({rooms: res});
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  leaveRoom = (roomId) => {
    const { rooms } = this.state;
    req('/api/chat/room/leave/' + roomId)
    .then(res => {
      let copy = rooms.slice();
      copy.map(room => {
        if (room.id == roomId)
          room.display = 0;
      });
      this.setState({
        rooms: copy,
        room : {
          ...this.state.room,
          display: 0
        }
      });
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  onNewMessage = () => {
    const { socket } = this.props;
    socket.on('new_message', (data) => {
      const { rooms } = this.state;
      if (data.roomId == this.state.room.id)
        this.addMessage(data.fromId, data.msg);
      let copy = rooms.slice();
      copy.map(room => {
        if (room.id == data.roomId)
          room.unread += 1;
      });
      this.setState({rooms: copy});
    });
  }

  componentWillMount() {
    this.getRooms();
    this.onNewMessage();
  }

  render() {
    const { messages, room } = this.state;
    const { locale } = this.props.locales;
    return (
      <div className="window-chat z-depth-2" style={{display: 'none'}}>
        <div className="window-chat-room">
          <span>
            {room.id ? <Link to={'/user/' + room.user.id}>{room.user.username}</Link> : locale.chat.room_select}
            {room.id && <i className="material-icons" onClick={() => this.leaveRoom(room.id)}>exit_to_app</i> }
          </span>
          <div className="divider"></div>
          <div className="window-chat-room-body">
          {messages.map((message, i) => {
            return (
              <div key={i}>
                {message.id_from == room.user.id &&
                  <div key={message.id} className="window-chat-msg clearfix">
                    <div className="window-chat-msg-pic" style={{backgroundImage: 'url("/pictures/user/' + room.user.pic + '")'}}></div>
                    <p>{message.message}</p>
                  </div>
                }
                {message.id_from != room.user.id &&
                  <div key={message.id} className="window-chat-msg clearfix window-chat-msg-right">
                    <p>{message.message}</p>
                  </div>
                }
              </div>
            )
          })}
          </div>
          {room.id &&
            (room.display ? (
              <div className="window-chat-room-input">
                <form onSubmit={this.handleSubmit}>
                  <div className="input-field">
                    <input name="message" id="message" type="text" className="validate" onChange={this.onChange}/>
                    <label htmlFor="message">Message</label>
                  </div>
                </form>
              </div>
            ) : <div className="m-10"><em>{locale.chat.room_unactive}</em></div>
            )
          }
        </div>
        <div className="window-chat-side">
          <WindowChatSide rooms={this.state.rooms} changeRoom={this.changeRoom} active={this.state.room.id} />
        </div>
      </div>
    );
  }
}

export default withAllHOC(Chat);
