import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css';
import SideChat from './chat/SideChat'
import '../../css/chat.css'

class Chat extends Component {

  state = {
    message: ''
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { id } = this.props.currentUser;
    const { socket } = this.props;
    // todo : envoyer le message
    socket.emit('new_msg', {id: id, msg: this.state.message});
    document.querySelector('#message').value = '';
  }

  getRooms = () => {
    fetch('/api/chat/room/').then(response => {
      console.log(response);
      if (response.ok) {
        response.json().then(json => {
          console.log(json);
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
    return (
      <div className="chat z-depth-2">
          <div className="chat-room">
            <h6>Xavier Niel</h6>
            <div className="divider"></div>
            <div className="chat-room-body">
              <div className="chat-msg clearfix">
                <img src="http://lorempixel.com/400/400/"/>
                <p>Coucou</p>
              </div>
              <div className="chat-msg clearfix chat-msg-right">
                <p>Ok mdr</p>
              </div>
              <div className="chat-msg clearfix">
                <img src="http://lorempixel.com/400/400/"/>
                <p>Coucou</p>
              </div>
              <div className="chat-msg clearfix chat-msg-right">
                <p>Ok mdr</p>
              </div>
              <div className="chat-msg clearfix">
                <img src="http://lorempixel.com/400/400/"/>
                <p>Coucou</p>
              </div>
              <div className="chat-msg clearfix chat-msg-right">
                <p>Ok mdr</p>
              </div>
              <div className="chat-msg clearfix">
                <img src="http://lorempixel.com/400/400/"/>
                <p>Coucou</p>
              </div>
              <div className="chat-msg clearfix chat-msg-right">
                <p>Ok mdr</p>
              </div>
              <div className="chat-msg clearfix">
                <img src="http://lorempixel.com/400/400/"/>
                <p>Coucou</p>
              </div>
              <div className="chat-msg clearfix chat-msg-right">
                <p>Ok mdr</p>
              </div>
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
            <SideChat />
          </div>
      </div>
    );
  }
}

export default withAllHOC(Chat);
