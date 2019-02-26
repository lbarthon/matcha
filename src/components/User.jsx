import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import { notify } from '../utils/alert';
import '../css/user.css';

class User extends Component {

  state = {
    username: '',
    description: '',
    gender: '',
    pictures: [],
  }

  getUser = () => {
    const { id } = this.props.match.params;
    fetch('/api/user/' + id)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          json = json.response;
          this.setState({
            username: json.username,
            description: json.description,
            gender: json.sex
          })
        });
      } else { console.error(new Error(response.statusText)); }
    })
  }

  getPictures = () => {
    fetch('/api/pictures/get')
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          if (json['error'] == null && json['success'] !== this.state.pictures)
            this.setState({ pictures: json['success'] });
          else if (json['error'])
            notify('error', this.props.locales.idParser(json['error']));
        });
      } else console.error(new Error(response.statusText));
    });
  }

  componentWillMount() {
    console.log('user mount')
    this.getUser();
    this.getPictures();
  }

  componentDidMount() {
    document.title = this.state.username;
  }

  render() {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        <h4>{this.state.username}</h4>
        <div className="pictures">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h6>Description</h6>
        <p>{this.state.description}</p>
        <h6>Gender</h6>
        <p>{this.state.gender}</p>
        <a className="waves-effect waves-light btn"><i className="material-icons left">favorite</i>{locale.user.like}</a>
        <a className="waves-effect waves-light btn red right ml-10"><i className="material-icons left">block</i>{locale.user.block}</a>
        <a className="waves-effect waves-light btn red right"><i className="material-icons left">priority_high</i>{locale.user.report}</a>
      </React.Fragment>
    )
  }
}
export default withAllHOC(User);
