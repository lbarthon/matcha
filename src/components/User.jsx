import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import '../css/user.css';

class User extends Component {

  state = {
    username: '',
    description: '',
    gender: ''
  }

  componentWillMount() {
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
      } else { throw Error(response.statusText); }
    })
    .catch(error => { console.log(error); })
  }

  componentDidMount() {
    document.title = this.state.username;
  }

  render() {
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
        {this.state.gender}
      </React.Fragment>
    )
  }
}
export default withAllHOC(User);
