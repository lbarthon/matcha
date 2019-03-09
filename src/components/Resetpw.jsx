import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/alert';
import { withAllHOC } from '../utils/allHOC';

class Resetpw extends Component {

  state = {
    password: "",
    repassword: ""
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();
    parseForm(this.state, strForm => {
      fetch("/api/reset/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'CSRF-Token' : localStorage.getItem('csrf')
        },
        body: strForm
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json.error) {
              notify('error', locales.idParser(json.error));
            } else {
              notify('success', locales.idParser(json.success));
            }
          })
        }
      }).catch(() => {
        // Handle error lmao
      });
    })
  }

  render() {
    const {locale} = this.props.locales;
    return (
      <form onSubmit={this.handleSubmit} className="col s12">
        <div className="row">
          <div className="input-field col s12">
            <input name="password" id="password" type="password" className="validate" onChange={this.onChange} />
            <label htmlFor="password">{locale.password}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input name="repassword" id="repassword" type="password" className="validate" onChange={this.onChange} />
            <label htmlFor="repassword">{locale.repassword}</label>
          </div>
        </div>
        <button className="btn waves-effect waves-light">{locale.update.btn}</button>
      </form>
    );
  }
}

export default withAllHOC(Resetpw);
