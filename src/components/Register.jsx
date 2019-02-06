import React, { Component } from 'react';


class Register extends Component {

  state = {
    name: '',
    location: '',
    day: '',
    month: '',
    year: '',
    genre: '',
    wanted: '',
    email: '',
    password: '',
    repassword: '',
    description: '',
    files: '',
    type: ''
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  parseForm = (form) => {
    return new Promise(resolve => {
      let newForm = [];
      for (let key in form) {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(form[key]);
        newForm.push(encodedKey + '=' + encodedValue);
      }
      let result = newForm.join('&')
      resolve(result);
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.parseForm(this.state)
    .then(result => {
      console.log(result);
      fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: result
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
        <h1>{this.state.test}</h1>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">person</i>
            <input name="name" id="last_name" type="text" className="validate" onChange={this.onChange}/>
            <label htmlFor="last_name">Name</label>
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
                <input name="gender" value="m" type="radio" />
                <span>M</span>
              </label>
            </p>
            <p>
              <label>
                <input name="gender" value="f" type="radio" />
                <span>F</span>
              </label>
            </p>
          </div>
          <div className="input-field col s6">
            <div><label>Looking</label></div>
            <p>
              <label>
                <input name="wanted" value="m" type="radio"/>
                <span>M</span>
              </label>
            </p>
            <p>
              <label>
                <input name="wanted" value="f" type="radio" />
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
        <div className="file-field input-field">
          <div className="btn">
            <span>File</span>
            <input type="file" accept="image/*" multiple onChange={this.onChange} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder="Upload one or more pictures" />
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
