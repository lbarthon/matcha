import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css';
import SideChat from './chat/SideChat'
import '../../css/chat.css'
import { notify } from '../../utils/alert';
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
    fetch('/api/chat/message/read/' + roomId).then(response => {
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

  getMessages = (roomId) => {
    this.state.rooms.map(room => { if (room.id == roomId) this.setState({room: room}) });
    fetch('/api/chat/message/' + roomId).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({messages: json.success}, () => {
              let chat = document.querySelector('.chat-room-body');
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
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
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
    fetch('/api/chat/room/').then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({rooms: json.success}, () => {

            });
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

  }

  render() {
    const { messages, room } = this.state;
    return (
      <div className="chat z-depth-2">
        <div className="chat-room">
          <b>{room.id ? <Link to={'/user/' + room.user.id}>{room.user.username}</Link> : 'Selectionnez un salon'}</b>
          <div className="divider"></div>
          <div className="chat-room-body">
          {messages.map(message => {
            return (
              <React.Fragment>
                {message.id_from == room.user.id &&
                  <div key={message.id} className="chat-msg clearfix">
                    <img src={this.state.room.user.pic != null ? '/pictures/user/' + room.user.pic : '/pictures/user/default.jpg'}/>
                    <p>{message.message}</p>
                  </div>
                }
                {message.id_from != room.user.id &&
                  <div key={message.id} className="chat-msg clearfix chat-msg-right">
                    <p>{message.message}</p>
                  </div>
                }
              </React.Fragment>
            )
          })}
          </div>
          {room.id &&
            <div className="chat-room-input">
              <form onSubmit={this.handleSubmit}>
                <div className="input-field">
                  <input name="message" id="message" type="text" className="validate" onChange={this.onChange}/>
                  <label for="message">Message</label>
                </div>
              </form>
            </div>
          }
        </div>
        <div className="chat-side">
          <SideChat rooms={this.state.rooms} getMessages={this.getMessages} active={this.state.room.id} />
        </div>
      </div>
    );
  }
}

export default withAllHOC(Chat);
