import React, { Component } from 'react';

class Register extends Component {
  render() {
    return(
      <form method="POST" class="col s12">
      <div className="row">
        <div className="input-field col s12">
          <input name="username" id="last_name" type="text" className="validate"/>
          <label for="last_name">First Name</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12">
          <select name="gender">
            <option value="" disabled selected>Choose your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label>Materialize Select</label>
        </div>
        <div className="input-field col s12">
          <select name="lookingfor">
            <option value="" disabled selected>Looking for</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label>Materialize Select</label>
        </div>
        <div className="input-field col s6">
          <input name="password" id="password" type="password" className="validate"/>
          <label for="password">Password</label>
        </div>
        <div className="input-field col s6">
          <input name="repassword" id="repassword" type="password" className="validate"/>
          <label for="repassword">Repeat password</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12">
          <input name=""id="email" type="email" className="validate"/>
          <label for="email">Email</label>
        </div>
      </div>
      <button className="btn waves-effect waves-light">Register</button>
    </form>
    );
  }
}

export default Register;
