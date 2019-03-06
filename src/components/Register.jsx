import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/alert';
import { withLocalesHOC } from '../utils/locales';
import M from 'materialize-css';
import Map from './update/Map';

class Register extends Component {

  state = {
    username: '',
    firstname: '',
    lastname: '',
    location: '',
    birthdate: '',
    sex: '',
    wanted: '',
    email: '',
    pwd: '',
    repassword: '',
    description: ''
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleLocationChange = location => {
    this.setState({ location: location.lat + ";" + location.lng });
  }

  handleSubmit = e => {
    const { locales } = this.props;
    //e.preventDefault();
    parseForm(this.state, strForm => {
      fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: strForm
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json['error']) {
              notify('error', locales.idParser(json['error']));
            } else if (json['success']) {
              notify('success', locales.idParser(json['success']));
            }
          });
        } else console.error(new Error(response.statusText));
      })
      .catch(() => {
        // TO HANDLE 
      })
    });
  }

  // Padding for date
  pad(s) {
    return (s < 10) ? '0' + s : s;
  }

  initDatepicker = () => {
    let elems = document.querySelectorAll('.datepicker');
    let instances = M.Datepicker.init(elems, {
      format: 'dd/mm/yyyy',
      defaultDate : new Date('01/01/1995'),
      autoClose: true,
      onSelect: date => {
        this.setState({
          birthdate: [this.pad(date.getDate()), this.pad(date.getMonth()+1), date.getFullYear()].join('/')
        });
      }
    });
  }

  initSelect = () => {
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems, {});
  }

  componentDidMount () {
    const {locale} = this.props.locales;
    document.title = locale.title.register;
    this.initDatepicker();
    this.initSelect();
  }

  render() {
    const {locale} = this.props.locales;
    return (
      <form id="temporaire" onSubmit={this.handleSubmit} className="col s12">
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
          <label>{locale.register.location}</label>
          <Map onChange={this.handleLocationChange} />
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
            <select name="sex" onChange={this.onChange}>
              <option defaultValue="" disabled selected>{locale.register.select_gender}</option>
              <option defaultValue="male">{locale.gender.male}</option>
              <option defaultValue="female">{locale.gender.female}</option>
            </select>
            <label>{locale.register.gender}</label>
          </div>
          <div className="input-field col s6">
            <select name="wanted" onChange={this.onChange}>
              <option defaultValue="" disabled selected>{locale.register.select_gender}</option>
              <option defaultValue="male">{locale.gender.male}</option>
              <option defaultValue="female">{locale.gender.female}</option>
            </select>
            <label>{locale.register.lookingfor}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">mode_edit</i>
            <textarea name="description" id="textarea1" className="materialize-textarea" onChange={this.onChange}></textarea>
            <label htmlFor="textarea1">{locale.register.about}<br/></label>
          </div>
        </div>
        <button className="btn waves-effect waves-light">{locale.register.btn}</button>
      </form>
    );
  }
}

export default withLocalesHOC(Register);
