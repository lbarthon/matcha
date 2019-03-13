import React, { Component } from 'react';
import { notify } from '../utils/alert';
import { localeIdParser } from '../utils/locales';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';
import httpBuildQuery from 'http-build-query';
import Map from './update/Map';
import req from '../utils/req';

class Update extends Component {
  state = {
    user : undefined,
    tags: [],
    tagsList: {},
  }

  onChange = e => {
    this.setState({
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value
      }
    });
  }

  handleLocationChange = location => {
    this.setState({
      user: {
        ...this.state.user,
        location: location.lat + ";" + location.lng
      }
    });
  }

  handleSubmit = e => {
    let tags = {tags: this.state.tags}
    tags = httpBuildQuery(tags);
    const user = httpBuildQuery(this.state.user);
    const { locales } = this.props;
    e.preventDefault();
    // update tags
    req('/api/tags/update', tags)
    .then(res => {
      this.getTags();
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
    // update user
    req('/api/update', user)
    .then(res => {
      notify('success', locales.idParser(res));
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
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
        this.setState({
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
    this.setState({tags: instance.chipsData});
  }

  getUser = () => {
    req('api/user/current')
    .then(res => {
      this.setState({ user: res }, () => {
        this.initDatepicker();
        this.initSelect();
      });
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  getTagsList = () => {
    const {locales} = this.props;
    fetch('/api/tags/list')
    .then(res => {
      const obj = {};
      res.map((tag, i) => { obj[tag.tag] = null; });
      this.setState({tagsList: obj}, () => {
        this.initTags();
      });
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  getTags = () => {
    const {locales} = this.props;
    req('/api/tags')
    .then(res => {
      this.setState({tags: res}, () => {
        this.initTags();
      });
    })
    .catch(err => {
      notify('error', this.props.locales.idParser(err));
    })
  }

  componentWillMount() {
    this.getUser();
    this.getTagsList();
    this.getTags();
  }

  componentDidMount() {
    const {locale} = this.props.locales;
    document.title = locale.title.update;
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
            <select name="gender" onChange={this.onChange}>
              <option value="" disabled>{locale.register.select_gender}</option>
              <option value="male" selected={sex == 'male' ? true : false}>{locale.gender.male}</option>
              <option value="female" selected={sex == 'female' ? true : false}>{locale.gender.female}</option>
            </select>
            <label>{locale.register.gender}</label>
          </div>
          <div className="input-field col s6">
            <select name="wanted" onChange={this.onChange}>
              <option value="bisexual" selected={wanted == 'bisexual' ? true : false}>{locale.gender.bisexual}</option>
              <option value="male" selected={wanted == 'male' ? true : false}>{locale.gender.male}</option>
              <option value="female" selected={wanted == 'female' ? true : false}>{locale.gender.female}</option>
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
