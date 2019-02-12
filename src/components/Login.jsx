import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/Alert';

class Login extends Component {

  state = {
    username: '',
    pwd: '',
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    parseForm(this.state, strForm => {
      fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: strForm
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json['error']) {
              notify('error', json['error']);
            } else if (json['success']) {
              notify('success', json['success']);
            }
          });
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(error => {
        console.log(error)
      });
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="col s12">
        <div className="row">
          <div className="input-field col s12">
            <input name="username" id="username" type="text" className="validate" onChange={this.onChange} />
            <label htmlFor="username">Username</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input name="pwd" id="pwd" type="password" className="validate" onChange={this.onChange} />
            <label htmlFor="pwd">Password</label>
          </div>
        </div>
        <button className="btn waves-effect waves-light">Log In</button>
      </form>
    );
  }
}

export default Login;
