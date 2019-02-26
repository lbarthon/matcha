import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/alert';
import { withLocalesHOC } from '../utils/locales';
import M from 'materialize-css'

class Register extends Component {

  state = {
    username: '',
    firstname: '',
    lastname: '',
    location: '',
    birthdate: '',
    genre: '',
    lookingFor: '',
    email: '',
    pwd: '',
    repassword: '',
    description: ''
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = e => {
    const { locales } = this.props;
    e.preventDefault();
    console.log(this.state)
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
        // handle error
        console.error(error)
      });
    });
  }

  initDatepicker = () => {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {
      format: 'dd/mm/yyyy',
      defaultDate : new Date('01/01/1995'),
      autoClose: true,
      onSelect: date => { this.setState({ birthdate: date.toString() }); }
    });
  }

  componentDidMount () {
    const {locale} = this.props.locales;
    document.title = locale.title.register;
    this.initDatepicker();
  }

  render() {
    const {locale} = this.props.locales;
    return (
      <form onSubmit={this.handleSubmit} className="col s12">
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">person</i>
            <input name="username" id="username" type="text" className="validate" onChange={this.onChange}/>
            <label htmlFor="username">{locale.username}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">person</i>
            <input name="firstname" id="firstname" type="text" className="validate" onChange={this.onChange}/>
            <label htmlFor="firstname">{locale.firstname}</label>
          </div>
          <div className="input-field col s6">
            <input name="lastname" id="lastname" type="text" className="validate" onChange={this.onChange}/>
            <label htmlFor="lastname">{locale.lastname}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">alternate_email</i>
            <input name="email" id="email" type="email" className="validate" onChange={this.onChange}/>
            <label htmlFor="email">{locale.email}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">vpn_key</i>
            <input name="pwd" id="pwd" type="password" className="validate" onChange={this.onChange} />
            <label htmlFor="pwd">{locale.password}</label>
          </div>
          <div className="input-field col s6">
            <input name="repassword" id="repassword" type="password" className="validate" onChange={this.onChange} />
            <label htmlFor="repassword">{locale.repassword}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">location_city</i>
            <input name="location" id="location" type="text" className="validate" onChange={this.onChange}/>
            <label htmlFor="location">{locale.register.location}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">cake</i>
            <input name="birthdate" id="birthdate" type="text" class="datepicker" onChange={this.onChange}/>
            <label htmlFor="birthdate">{locale.register.birthdate}</label>
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
        <button className="btn waves-effect waves-light">{locale.register.btn}</button>
      </form>
    );
  }
}

export default withLocalesHOC(Register);
