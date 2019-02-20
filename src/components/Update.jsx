import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/alert';
import { localeIdParser } from '../utils/locales';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';

class Update extends Component {
  state = {
    username: '',
    location: '',
    day: '',
    month: '',
    year: '',
    genre: '',
    lookingFor: '',
    email: '',
    newpassword: '',
    repassword: '',
    description: ''
  }

  onChange = e => {
  //  this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    const { locales } = this.props;
    e.preventDefault();
    parseForm(this.state, strForm => {
      fetch('/api/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: strForm
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            console.log(json);
            if (json['error']) {
              notify('error', locales.idParser(json['error']));
            } else if (json['success']) {
              notify('success', locales.idParser(json['success']));
            }
          });
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(error => {
        console.log(error)
      });
    });
  }

  componentWillMount() {
    fetch('api/user/infos')
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          console.log(json.response)
          this.setState({
            username: json.response.username,
            wanted: json.response.wanted,
            email: json.response.email
          });
        });
      }
    })
  }

  componentDidMount () {
    const {locale} = this.props.locales;
    document.title = locale.title.update;
  }

  render() {
    const {locale} = this.props.locales;
    if (!this.state.username) return null;
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field col s12">
              <i className="material-icons prefix">person</i>
              <input name="username" id="username" type="text" value={this.state.username} className="validate" onChange={this.onChange}/>
              <label className="active" htmlFor="username">{locale.username}</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <i className="material-icons prefix">location_city</i>
              <input name="location" id="location" type="text" className="validate" onChange={this.onChange}/>
              <label className="active" htmlFor="location">{locale.register.location}</label>
            </div>
          </div>
          <label>{locale.register.birthdate}</label>
          <div className="row">
            <div className="input-field col s2">
              <input name="day" id="day" type="text" className="validate" onChange={this.onChange}/>
              <label className="active" htmlFor="day">{locale.register.day}</label>
            </div>
            <div className="input-field col s2">
              <input name="month" id="month" type="text" className="validate" onChange={this.onChange}/>
              <label className="active" htmlFor="month">{locale.register.month}</label>
            </div>
            <div className="input-field col s8">
              <input name="year" id="year" type="text" className="validate" onChange={this.onChange}/>
              <label className="active" htmlFor="year">{locale.register.year}</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <div><label>{locale.register.gender}</label></div>
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
              <div><label>{locale.register.lookingfor}</label></div>
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
              <input name="email" id="email" type="email" value={this.state.email} className="validate" onChange={this.onChange}/>
              <label className="active" htmlFor="email">{locale.email}</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <i className="material-icons prefix">mode_edit</i>
              <textarea name="description" id="textarea1" className="materialize-textarea" onChange={this.onChange}></textarea>
              <label htmlFor="textarea1">{locale.register.about}<br/></label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <i className="material-icons prefix">favorite</i>
              <textarea name="tags" id="textarea2" className="materialize-textarea" onChange={this.onChange}></textarea>
              <label htmlFor="textarea2">{locale.register.tags}<br/></label>
              <span className="helper-text" data-error="wrong" data-success="right">ex : bio geek piercing vegan ...</span>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <i className="material-icons prefix">vpn_key</i>
              <input name="newpassword" id="newpassword" type="password" className="validate" onChange={this.onChange} />
              <label htmlFor="newpassword">{locale.update.newpassword}</label>
            </div>
            <div className="input-field col s6">
              <input name="repassword" id="repassword" type="password" className="validate" onChange={this.onChange} />
              <label htmlFor="repassword">{locale.repassword}</label>
            </div>
          </div>
          <button className="btn waves-effect waves-light">{locale.update.btn}</button>
        </form>
      </React.Fragment>
    );
  }
}

export default withAllHOC(Update);