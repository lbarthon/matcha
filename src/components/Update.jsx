import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/alert';
import { localeIdParser } from '../utils/locales';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';
import httpBuildQuery from 'http-build-query';

class Update extends Component {
  state = {
    username: '',
    firstname: '',
    lastname: '',
    location: '',
    birthdate: '',
    gender: '',
    wanted: '',
    email: '',
    pwd: '',
    repassword: '',
    newpassword: '',
    description: '',
    tags: [],
    tagsList: {},
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
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
            if (json.error) {
              notify('error', locales.idParser(json.error));
            } else if (json['success']) {
              notify('success', locales.idParser(json['success']));
            }
          });
        } else console.error(new Error(response.statusText));
      })
    });
  }

  initDatepicker = () => {
    let elems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(elems, {
      format: 'dd/mm/yyyy',
      defaultDate : new Date('01/01/1995'),
      autoClose: true,
      onSelect: date => { this.setState({ birthdate: date.toString() }); }
    });
  }

  initSelect = () => {
    let elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
  }

  getUser = () => {
    const { locales } = this.props;
    fetch('/api/user/current')
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            const res = json.success
            this.setState({
              username: res.username,
              wanted: res.wanted,
              gender: res.sex,
              email: res.email,
              firstname: res.firstname,
              lastname: res.lastname,
              description: res.description
            });
          } else if (json.error)
            notify('error', locales.idParser(json.error));
        });
      } else console.error(new Error(response.statusText));
    });
  }

  getTagsList = () => {
    const {locales} = this.props;
    fetch('/api/tags/list')
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            const res = json.success;
            const obj = {};
            res.map((tag, i) => { obj[tag.tag] = null; });
            this.setState({tagsList: obj}, () => {
              this.initTags();
            });
          } else
            notify('error', locales.idParser(json.error))
        });
      } else console.error(new Error(response.statusText));
    });
  }

  getTags = () => {
    const {locales} = this.props;
    fetch('/api/tags')
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.success) {
            console.log(json.success);
            this.setState({tags: json.success}, () => {
              this.initTags();
            });
          } else
            notify('error', locales.idParser(json.error))
        });
      } else console.error(new Error(response.statusText));
    });
  }

  initTags = () => {
    let elems = document.querySelectorAll('.chips');
    M.Chips.init(elems, {
      data: this.state.tags,
      autocompleteOptions: {
        data: this.state.tagsList
      },
      onChipAdd: () => { this.getChipsData(); },
      onChipDelete: () => { this.getChipsData(); }
    });
  }

  getChipsData = () => {
    const instance = M.Chips.getInstance(document.querySelector('.chips'));
    this.setState({tags: instance.chipsData})
  }

  componentWillMount() {
    this.getUser();
    this.getTagsList();
    this.getTags();
  }

  componentDidMount() {
    const {locale} = this.props.locales;
    document.title = locale.title.update;
    this.initDatepicker();
  }

  componentDidUpdate() {
    this.initSelect();
  }

  render() {
    const {locale} = this.props.locales;
    if (this.state.username === '') return null;
    const {username, firstname, lastname, email, description, gender, wanted} = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="col s12">
        <div className="row">
          <div className="col s12">
            <label>{locale.register.tags}</label>
            <div className="chips chips-autocomplete"></div>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">person</i>
            <input value={username} name="username" id="username" type="text" className="validate" onChange={this.onChange}/>
            <label className="active" htmlFor="username">{locale.username}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">person</i>
            <input value={firstname} name="firstname" id="firstname" type="text" className="validate" onChange={this.onChange}/>
            <label className="active" htmlFor="firstname">{locale.firstname}</label>
          </div>
          <div className="input-field col s6">
            <input value={lastname} name="lastname" id="lastname" type="text" className="validate" onChange={this.onChange}/>
            <label className="active" htmlFor="lastname">{locale.lastname}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">alternate_email</i>
            <input value={email} name="email" id="email" type="email" className="validate" onChange={this.onChange}/>
            <label className="active" htmlFor="email">{locale.email}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <i className="material-icons prefix">vpn_key</i>
            <input name="pwd" id="pwd" type="password" className="validate" onChange={this.onChange} />
            <label htmlFor="pwd">{locale.update.newpassword}</label>
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
            <label className="active" htmlFor="location">{locale.register.location}</label>
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
            <select name="gender" onChange={this.onChange}>
              <option value="" disabled>{locale.register.select_gender}</option>
              <option value="male" selected={gender === 'female' ? true : false}>{locale.gender.male}</option>
              <option value="female" selected={gender === 'female' ? true : false}>{locale.gender.female}</option>
            </select>
            <label>{locale.register.gender}</label>
          </div>
          <div className="input-field col s6">
            <select name="wanted" onChange={this.onChange}>
              <option value="" disabled>{locale.register.select_gender}</option>
              <option value="male">{locale.gender.male}</option>
              <option value="female">{locale.gender.female}</option>
            </select>
            <label>{locale.register.lookingfor}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">mode_edit</i>
            <textarea value={description} name="description" id="textarea1" className="materialize-textarea" onChange={this.onChange}></textarea>
            <label className="active" htmlFor="textarea1">{locale.register.about}<br/></label>
          </div>
        </div>
        <button className="btn waves-effect waves-light">{locale.register.btn}</button>
      </form>
    );
  }
}

export default withAllHOC(Update);
