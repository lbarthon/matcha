import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';
import SideChat from './chat/SideChat'
import '../css/chat.css'

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

  componentWillMount() {

  }

  componentDidMount() {
    document.title = 'Chat';
  }

  render() {
    return (
      <div className="row">
        <div className="col s12 m5 l4">
          <SideChat />
        </div>
        <div className="col s12 m7 l8">
          <h6>Xavier Niel</h6>
          <div className="divider"></div>
          <div className="chat-msg clearfix">
            <img src="http://lorempixel.com/400/400/"/>
            <p>Coucou</p>
          </div>
          <div className="chat-msg clearfix">
            <img src="http://lorempixel.com/400/400/"/>
            <p>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500</p>
          </div>
          <div className="chat-msg clearfix chat-msg-right">
            <img src="http://lorempixel.com/400/400/"/>
            <p>Ok mdr</p>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="input-field col s12">
                <input name="message" id="message" type="text" className="validate" onChange={this.onChange}/>
                <label for="message">Message</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withAllHOC(Chat);
