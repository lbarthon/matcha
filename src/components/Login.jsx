import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/alert';
import { withAllHOC } from '../utils/allHOC';

class Login extends Component {

  state = {
    username: '',
    pwd: '',
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    const { locales } = this.props;
    const { getCurrentUser } = this.props.currentUser;
    const { history } = this.props;
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
            if (json.error) {
              notify('error', locales.idParser(json.error));
            } else if (json.sucess) {
              getCurrentUser(() => {
                history.push("/");
                notify('success', locales.idParser(json.sucess));
              });
            }
          });
        } else { throw Error(response.statusText); }
      })
      .catch(error => {
        // handle error
        console.error(error);
      });
    });
  }

  componentDidMount () {
    const {locale} = this.props.locales;
    document.title = locale.title.login;
  }

  render() {
    const {locale} = this.props.locales;
    return (
      <form onSubmit={this.handleSubmit} className="col s12">
        <div className="row">
          <div className="input-field col s12">
            <input name="username" id="username" type="text" className="validate" onChange={this.onChange} />
            <label htmlFor="username">{locale.username}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input name="pwd" id="pwd" type="password" className="validate" onChange={this.onChange} />
            <label htmlFor="pwd">{locale.password}</label>
          </div>
        </div>
        <button className="btn waves-effect waves-light">{locale.login.btn}</button>
      </form>
    );
  }
}

export default withAllHOC(Login);
