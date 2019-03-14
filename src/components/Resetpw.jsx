import React, { Component } from 'react';
import { alert } from '../utils/alert';
import { withAllHOC } from '../utils/allHOC';
import req from '../utils/req';

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
    req('/api/reset', this.state)
    .then(res => {
      alert('success', locales.idParser(res));
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
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
