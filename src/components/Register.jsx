import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/Alert';


class Register extends Component {

  state = {
    name: '',
    location: '',
    day: '',
    month: '',
    year: '',
    genre: '',
    lookingFor: '',
    email: '',
    password: '',
    repassword: '',
    description: ''
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();
    parseForm(this.state, strForm => {
      fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: strForm
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            console.log(json);
            notify(json[0], json[1]);
            notify('success', 'test');
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
            <i className="material-icons prefix">person</i>
            <input name="name" id="last_name" type="text" className="validate" onChange={this.onChange}/>
            <label htmlFor="last_name">Username</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">location_city</i>
            <input name="location" id="location" type="text" className="validate" onChange={this.onChange}/>
            <label htmlFor="location">Location</label>
          </div>
        </div>
        <label>Birthdate</label>
        <div className="row">
          <div className="input-field col s2">
            <input name="day" id="day" type="text" className="validate" onChange={this.onChange}/>
            <label htmlFor="day">Day</label>
          </div>
          <div className="input-field col s2">
            <input name="month" id="month" type="text" className="validate" onChange={this.onChange}/>
            <label htmlFor="month">Month</label>
          </div>
          <div className="input-field col s8">
            <input name="year" id="year" type="text" className="validate" onChange={this.onChange}/>
            <label htmlFor="year">Year</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <div><label>Gender</label></div>
            <p>
              <label>
                <input name="gender" value="m" type="radio" onChange={this.onChange}/>
                <span>M</span>
              </label>
            </p>
            <p>
              <label>
                <input name="gender" value="f" type="radio" onChange={this.onChange}/>
                <span>F</span>
              </label>
            </p>
          </div>
          <div className="input-field col s6">
            <div><label>Looking for</label></div>
            <p>
              <label>
                <input name="lookingFor" value="m" type="radio" onChange={this.onChange}/>
                <span>M</span>
              </label>
            </p>
            <p>
              <label>
                <input name="lookingFor" value="f" type="radio" onChange={this.onChange}/>
                <span>F</span>
              </label>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">alternate_email</i>
            <input name="email" id="email" type="email" className="validate" onChange={this.onChange}/>
            <label htmlFor="email">Email</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">vpn_key</i>
            <input name="password" id="password" type="password" className="validate" onChange={this.onChange} />
            <label htmlFor="password">Password</label>
          </div>
          <div className="input-field col s6">
            <input name="repassword" id="repassword" type="password" className="validate" onChange={this.onChange} />
            <label htmlFor="repassword">Repeat password</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">mode_edit</i>
            <textarea name="description" id="textarea1" className="materialize-textarea" onChange={this.onChange}></textarea>
            <label htmlFor="textarea1">About you...<br/></label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">favorite</i>
            <textarea name="tags" id="textarea2" className="materialize-textarea" onChange={this.onChange}></textarea>
            <label htmlFor="textarea2">Tags<br/></label>
            <span className="helper-text" data-error="wrong" data-success="right">ex : bio geek piercing vegan ...</span>
          </div>
        </div>
        <button className="btn waves-effect waves-light">Register</button>
      </form>
    );
  }
}

export default Register;
