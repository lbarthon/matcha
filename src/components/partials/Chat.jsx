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
      user : {
        username: '',
        pic: null
      }
    },
    message: ''
  }

  getMessages = (idRoom) => {
    console.log(idRoom);
    this.state.rooms.map(room => { if (room.id == idRoom) this.setState({room: room}) });
    fetch('/api/chat/message/' + idRoom).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({messages: json.success});
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
    const str = httpBuildQuery({message: this.state.message, roomId: this.state.room.id});
    fetch('/api/chat/message', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      body: str
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.getMessages(this.state.room.id);
          } else if (json.error) {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else console.error(new Error(response.statusText));
    })
    socket.emit('new_msg', {id: id});
    document.querySelector('#message').value = '';
  }

  getRooms = () => {
    fetch('/api/chat/room/').then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            this.setState({rooms: json.success}, () => {
              this.getMessages(this.state.rooms[0].id);
            });
          } else {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else console.error(new Error(response.statusText));
    });
  }

  componentWillMount() {
    this.getRooms();
  }

  componentDidMount() {

  }

  render() {
    const { messages, room } = this.state;
    return (
      <div className="chat z-depth-2">
          <div className="chat-room">
            <h6>{room.user.username}</h6>
            <div className="divider"></div>
            <div className="chat-room-body">
            {messages.map(message => {
              return (
                <React.Fragment>
                  {message.id_from == room.user.id &&
                    <div className="chat-msg clearfix">
                      <img src={this.state.room.user.pic != null ? '/pictures/user/' + room.user.pic : '/pictures/user/default.jpg'}/>
                      <p>{message.message}</p>
                    </div>
                  }
                  {message.id_from != room.user.id &&
                    <div className="chat-msg clearfix chat-msg-right">
                      <p>{message.message}</p>
                    </div>
                  }
                </React.Fragment>
              )
            })}
            </div>
          <div className="chat-room-input">
            <form onSubmit={this.handleSubmit}>
              <div className="input-field">
                <input name="message" id="message" type="text" className="validate" onChange={this.onChange}/>
                <label for="message">Message</label>
              </div>
              </form>
            </div>
          </div>
          <div className="chat-side">
            <SideChat rooms={this.state.rooms} getMessages={this.getMessages} />
          </div>
      </div>
    );
  }
}

export default withAllHOC(Chat);
