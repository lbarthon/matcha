import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/alert';
import { localeIdParser } from '../utils/locales';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';

class Update extends Component {
  state = {
    username: '',
    firstname: '',
    lastname: '',
    location: '',
    day: '',
    month: '',
    year: '',
    genre: '',
    wanted: '',
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
        // handle error
        console.log(error)
      });
    });
  }

  componentWillMount() {
    fetch('/api/user/current')
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json.error) {
            // GERE L'ERREUR MOSSIEU LE DEV FRONT
          } else {
            this.setState({
              username: json.response.username,
              wanted: json.response.wanted,
              sex: json.response.sex,
              email: json.response.email,
              firstname: json.response.firstname,
              lastname: json.response.lastname,
              description: json.response.description
            });
          }
        });
      }
    })
    .catch(err => {
      // handle error
      console.error(err);
    });
  }

  componentDidMount () {
    const {locale} = this.props.locales;
    document.title = locale.title.update;
  }

  render() {
    const {locale} = this.props.locales;
    const {username, firstname, lastname, email, description} = this.state;
    if (this.state.username == undefined) return null; // attendre state.username pour render -- err 500 ?
    return (
      <form onSubmit={this.handleSubmit} className="col s12">
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
                <input name="sex" value="m" type="radio" onChange={this.onChange} checked={this.state.sex === "m"}/>
                <span>M</span>
              </label>
            </p>
            <p>
              <label>
                <input name="sex" value="f" type="radio" onChange={this.onChange} checked={this.state.sex === "f"}/>
                <span>F</span>
              </label>
            </p>
          </div>
          <div className="input-field col s6">
            <div><label>{locale.register.lookingfor}</label></div>
            <p>
              <label>
                <input name="wanted" value="m" type="radio" onChange={this.onChange} checked={this.state.wanted === "m"}/>
                <span>M</span>
              </label>
            </p>
            <p>
              <label>
                <input name="wanted" value="f" type="radio" onChange={this.onChange} checked={this.state.wanted === "f"}/>
                <span>F</span>
              </label>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">mode_edit</i>
            <textarea value={description} name="description" id="textarea1" className="materialize-textarea" onChange={this.onChange}></textarea>
            <label className="active" htmlFor="textarea1">{locale.register.about}<br/></label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">favorite</i>
            <textarea name="tags" id="textarea2" className="materialize-textarea" onChange={this.onChange}></textarea>
            <label className="active" htmlFor="textarea2">{locale.register.tags}<br/></label>
            <span className="helper-text" data-error="wrong" data-success="right">ex : bio geek piercing vegan ...</span>
          </div>
        </div>
        <button className="btn waves-effect waves-light">{locale.register.btn}</button>
      </form>
    );
  }
}

export default withAllHOC(Update);
