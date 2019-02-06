import React, { Component } from 'react';
import parseForm from '../utils/parseForm';

class Login extends Component {

  state = {
    email: '',
    password: ''
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    parseForm(this.state)
    .then(strForm => {
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: strForm
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            console.log(json);
          });
        }
      });
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="col s12">
        <div className="row">
          <div className="input-field col s12">
            <input name="email" id="email" type="text" className="validate" onChange={this.onChange} />
            <label htmlFor="email">Email</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input name="password" id="password" type="password" className="validate" onChange={this.onChange} />
            <label htmlFor="password">Password</label>
          </div>
        </div>
        <button className="btn waves-effect waves-light">Log In</button>
      </form>
    );
  }
}

export default Login;
