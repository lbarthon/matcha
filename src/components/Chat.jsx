import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';
import SideChat from './chat/SideChat'
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

  changeRoom = (roomId) => {
    this.setState({messages: []});
    this.getMessages(roomId);
  }

  getMessages = (roomId) => {
    this.state.rooms.map(room => { if (room.id == roomId) this.setState({room: room}) });
    fetch('/api/chat/message/' + roomId).then(response => {
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
            this.setState({rooms: json.success});
          } else {
            notify('error', this.props.locales.idParser(json.error));
          }
        });
      } else console.error(new Error(response.statusText));
    });
  }

  leaveRoom = (roomId) => {
    fetch('/api/chat/room/leave/' + roomId).then(response => {
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
  render() {
    return (
      null
    );
  }
}

export default withAllHOC(Chat);
