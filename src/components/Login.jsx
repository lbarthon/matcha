import React, { Component } from 'react';

class Login extends Component {
  render() {
    return (
      <form method="POST" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input name="email" id="email" type="text" class="validate" />
            <label for="email">Email</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input name="password" id="password" type="password" class="validate" />
            <label for="password">Password</label>
          </div>
        </div>
        <button class="btn waves-effect waves-light">Log In</button>
      </form>
    );
  }
}

export default Login;
