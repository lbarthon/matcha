import React, { Component } from 'react';
import $ from 'jquery';

class Register extends Component {
  render() {
    return(
      <form method="POST" class="col s12">
        <div className="row">
          <div className="input-field col s12">
            <i class="material-icons prefix">person</i>
            <input name="username" id="last_name" type="text" className="validate"/>
            <label for="last_name">First Name</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i class="material-icons prefix">location_city</i>
            <input name="location" id="location" type="text" className="validate"/>
            <label for="location">Location</label>
          </div>
        </div>
        <label>Birthdate</label>
        <div className="row">
          <div className="input-field col s2">
            <input name="day" id="day" type="text" className="validate"/>
            <label for="day">Day</label>
          </div>
          <div className="input-field col s2">
            <input name="mounth" id="mounth" type="text" className="validate"/>
            <label for="mounth">Mounth</label>
          </div>
          <div className="input-field col s8">
            <input name="year" id="year" type="text" className="validate"/>
            <label for="year">Year</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <div><label>Gender</label></div>
            <p>
              <label>
                <input name="gender" type="radio" />
                <span>M</span>
              </label>
            </p>
            <p>
              <label>
                <input name="gender" type="radio" />
                <span>F</span>
              </label>
            </p>
          </div>
          <div className="input-field col s6">
            <div><label>Looking for</label></div>
            <p>
              <label>
                <input name="lookingfor" type="radio" />
                <span>M</span>
              </label>
            </p>
            <p>
              <label>
                <input name="lookingfor" type="radio" />
                <span>F</span>
              </label>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i class="material-icons prefix">alternate_email</i>
            <input name=""id="email" type="email" className="validate"/>
            <label for="email">Email</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <i class="material-icons prefix">vpn_key</i>
            <input name="password" id="password" type="password" className="validate"/>
            <label for="password">Password</label>
          </div>
          <div className="input-field col s6">
            <input name="repassword" id="repassword" type="password" className="validate"/>
            <label for="repassword">Repeat password</label>
          </div>
        </div>
        <div className="file-field input-field">
          <div className="btn">
            <span>File</span>
            <input type="file" multiple />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder="Upload one or more pictures" />
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i class="material-icons prefix">mode_edit</i>
            <textarea id="textarea1" className="materialize-textarea"></textarea>
            <label for="textarea1">About you...<br/></label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i class="material-icons prefix">favorite</i>
            <textarea id="textarea2" className="materialize-textarea"></textarea>
            <label for="textarea2">Tags<br/></label>
            <span class="helper-text" data-error="wrong" data-success="right">ex : bio geek piercing vegan ...</span>
          </div>
        </div>
        <button className="btn waves-effect waves-light">Register</button>
      </form>
    );
  }
}

export default Register;
