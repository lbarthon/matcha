import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css';
import WindowChatSide from './chat/WindowChatSide'
import '../../css/windowchat.css'
import { alert } from '../../utils/alert';
import httpBuildQuery from 'http-build-query';
import req from '../../utils/req';

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
    req('/api/chat/message/read/' + roomId)
    .then(res => {
      // peut etre replace par setState
      this.getRooms();
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  changeRoom = (roomId) => {
    this.setState({messages: []});
    this.getMessages(roomId);
  }

  getMessages = (roomId) => {
    this.state.rooms.map(room => { if (room.id == roomId) this.setState({room: room}) });
    req('/api/chat/message/' + roomId)
    .then(res => {
      this.setState({messages: res}, () => {
        let chat = document.querySelector('.window-chat-room-body');
        chat.scrollTop = chat.scrollHeight;
        this.setRead(roomId);
      });
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { id } = this.props.currentUser;
    const { socket } = this.props;
    const { message, room } = this.state;
    req('/api/chat/message', {message: message, roomId: room.id, toId: room.user.id})
    .then(res => {
      socket.emit('new_message', {to: room.user.id, roomId: room.id});
      this.getMessages(room.id);
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
      this.setState({rooms: res}, () => {
        if (this.state.rooms[0] && this.state.room.id === undefined)
        this.getMessages(this.state.rooms[0].id);
      });
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  leaveRoom = (roomId) => {
    req('/api/chat/room/leave/' + roomId)
    .then(res => {
      this.setState({
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

  componentWillMount() {
    const { socket } = this.props;
    this.getRooms();
    socket.on('new_message', (data) => {
      if (data.roomId == this.state.room.id)
        this.getMessages(this.state.room.id);
      this.getRooms();
    })
  }

  render() {
    const { messages, room } = this.state;
    const { locale } = this.props.locales
    const window = this.props.window !== undefined;
    return (
      <div className="window-chat z-depth-2" style={{display: 'none'}}>
        <div className="window-chat-room">
          <span>
            {room.id ? <Link to={'/user/' + room.user.id}>{room.user.username}</Link> : locale.chat.room_select}
            {room.id && <i className="material-icons" onClick={() => this.leaveRoom(room.id)}>exit_to_app</i> }
          </span>
          <div className="divider"></div>
          <div className="window-chat-room-body">
          {messages.map(message => {
            return (
              <React.Fragment>
                {message.id_from == room.user.id &&
                  <div key={message.id} className="window-chat-msg clearfix">
                    <img src={this.state.room.user.pic != null ? '/pictures/user/' + room.user.pic : '/pictures/user/default.jpg'}/>
                    <p>{message.message}</p>
                  </div>
                }
                {message.id_from != room.user.id &&
                  <div key={message.id} className="window-chat-msg clearfix window-chat-msg-right">
                    <p>{message.message}</p>
                  </div>
                }
              </React.Fragment>
            )
          })}
          </div>
          {room.id &&
            (room.display ? (
              <div className="window-chat-room-input">
                <form onSubmit={this.handleSubmit}>
                  <div className="input-field">
                    <input name="message" id="message" type="text" className="validate" onChange={this.onChange}/>
                    <label for="message">Message</label>
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
