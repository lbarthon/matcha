import React, { Component } from 'react';
import { alert } from '../utils/alert';
import { withAllHOC } from '../utils/allHOC';
import req from '../utils/req';
import AskReset from './login/AskReset';

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
    req('/api/login', this.state)
    .then(res => {
      getCurrentUser(() => {
        history.push("/");
        alert('success', locales.idParser(res));
      });
    })
    .catch(err => {
      alert('error', locales.idParser(err));
    })
  }

  componentDidMount () {
    const {locale} = this.props.locales;
    document.title = locale.title.login;
  }

  render() {
    const {locale} = this.props.locales;
    return (
      <React.Fragment>
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
        <AskReset/>
      </React.Fragment>
    );
  }
}

export default withAllHOC(Login);
