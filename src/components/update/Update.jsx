import React, { Component } from 'react';
import { alert } from '../../utils/alert';
import { localeIdParser } from '../../utils/locales';
import { withAllHOC } from '../../utils/allHOC';
import M from 'materialize-css';
import Map from './Map';
import req from '../../utils/req';

class Update extends Component {

  _isMounted = false;

  state = {
    user : undefined,
    tags: [],
    tagsList: {},
  }

  onChange = e => {
    this.setStateCheck({
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value
      }
    });
  }

  handleLocationChange = location => {
    this.setStateCheck({
      user: {
        ...this.state.user,
        location: location.lat + ";" + location.lng
      }
    });
  }

  handleSubmit = e => {
    const { locales } = this.props;
    e.preventDefault();
    req('/api/update', this.state.user)
    .then(res => {
      alert('success', locales.idParser(res));
      req('/api/tags/update', { tags: this.state.tags })
      .then(res => {
        this.getTags();
      })
      .catch(err => {
        alert('error', locales.idParser(err));
      })
    })
    .catch(err => {
      alert('error', locales.idParser(err));
    })
  }

  // Padding for date
  pad(s) {
    return (s < 10) ? '0' + s : s;
  }

  initDatepicker = () => {
    let elems = document.querySelectorAll('.datepicker');
    let dateSplit = this.state.user.birthdate.split("/");
    M.Datepicker.init(elems, {
      format: 'dd/mm/yyyy',
      defaultDate : new Date(dateSplit[1] + "-" + dateSplit[0] + "-" + dateSplit[2]),
      setDefaultDate: true,
      autoClose: true,
      onSelect: date => {
        this.setStateCheck({
          user: {
            ...this.state.user,
            birthdate: [this.pad(date.getDate()), this.pad(date.getMonth() + 1), date.getFullYear()].join('/')
          }
        });
      }
    });
  }

  initSelect = () => {
    let elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
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
    this.setStateCheck({tags: instance.chipsData});
  }

  getUser = () => {
    req('/api/user/current')
    .then(res => {
      this.setStateCheck({ user: res }, () => {
        this.initDatepicker();
        this.initSelect();
      });
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  getTagsList = () => {
    const {locales} = this.props;
    req('/api/tags/list')
    .then(res => {
      const obj = {};
      res.map((tag, i) => { obj[tag.tag] = null; });
      this.setStateCheck({tagsList: obj}, () => {
        this.initTags();
      });
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  getTags = () => {
    const {locales} = this.props;
    req('/api/tags')
    .then(res => {
      this.setStateCheck({tags: res}, () => {
        this.initTags();
      });
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  componentWillMount() {
    this.getUser();
    this.getTagsList();
    this.getTags();
    const {locale} = this.props.locales;
    document.title = locale.title.update;
  }

  _isMounted = false;
  setStateCheck = (state, callback) => {
    if (this._isMounted)
      this.setState(state, callback);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.user == undefined) return null;

    const {locale} = this.props.locales;
    const {username, firstname, lastname, email, description, location, sex, wanted} = this.state.user;

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
          <label>{locale.register.location}</label>
          <Map onChange={this.handleLocationChange} location={location} />
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">cake</i>
            <input name="birthdate" id="birthdate" type="text" className="datepicker"/>
            <label htmlFor="birthdate">{locale.register.birthdate}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <select name="sex" onChange={this.onChange} defaultValue={sex}>
              <option value="male" >{locale.gender.male}</option>
              <option value="female">{locale.gender.female}</option>
            </select>
            <label>{locale.register.gender}</label>
          </div>
          <div className="input-field col s6">
            <select name="wanted" onChange={this.onChange} defaultValue={wanted}>
              <option value="bisexual">{locale.gender.bisexual}</option>
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
        <button className="btn waves-effect waves-light">{locale.update.btn}</button>
      </form>
    );
  }
}

export default withAllHOC(Update);
