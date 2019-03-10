import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';
import ChatSide from './chat/ChatSide'
import '../css/chat.css'
import { notify } from '../utils/alert';
import httpBuildQuery from 'http-build-query';

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
    fetch('/api/chat/message/read/' + roomId, {
      headers: {'CSRF-Token' : localStorage.getItem('csrf')}
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.getRooms();
          } else {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else console.error(new Error(response.statusText));
    });
  }

  changeRoom = (roomId) => {
    this.setState({messages: []});
    this.getMessages(roomId);
  }

  getMessages = (roomId) => {
    this.state.rooms.map(room => { if (room.id == roomId) this.setState({room: room}) });
    fetch('/api/chat/message/' + roomId, {
      headers: {'CSRF-Token': localStorage.getItem('csrf')}
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({messages: json.success}, () => {
              let chat = document.querySelector('.window-chat-room-body');
              chat.scrollTop = chat.scrollHeight;
              this.setRead(roomId);
            });
          } else {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else console.error(new Error(response.statusText));
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { id } = this.props.currentUser;
    const { socket } = this.props;
    const { message, room } = this.state;
    const str = httpBuildQuery({message: message, roomId: room.id});
    fetch('/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'CSRF-Token': localStorage.getItem('csrf')
      },
      body: str
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            socket.emit('new_message', {to: room.user.id, roomId: room.id});
            this.getMessages(room.id);
          } else if (json.error) {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else console.error(new Error(response.statusText));
    })
    document.querySelector('#message').value = '';
  }

  getRooms = () => {
    const { room, rooms } = this.state;
    fetch('/api/chat/room/', {
      headers: {'CSRF-Token': localStorage.getItem('csrf')}
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({rooms: json.success}, () => {
              if (this.state.rooms[0] && this.state.room.id === undefined)
              this.getMessages(this.state.rooms[0].id);
            });
          } else {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else console.error(new Error(response.statusText));
    });
  }

  leaveRoom = (roomId) => {
    fetch('/api/chat/room/leave/' + roomId, {
      headers: {'CSRF-Token': localStorage.getItem('csrf')}
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({room : {
              ...this.state.room,
              display: 0
            }})
          } else {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else console.error(new Error(response.statusText));
    });
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

  componentDidMount() {
    document.title = 'Chat';
  }

  render() {
    const { room, messages } = this.state;
    const { locale } = this.props.locales;
    return (
      <div className="chat">
        <ChatSide rooms={this.state.rooms} changeRoom={this.changeRoom} active={this.state.room.id} />
        <h6>
          {room.id ? <Link to={'/user/' + room.user.id}>{room.user.username}</Link> : locale.chat.room_select}
          {room.id && <i className="material-icons right" onClick={() => this.leaveRoom(room.id)}>exit_to_app</i>}
        </h6>
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
    );
  }
}

export default withAllHOC(Chat);
