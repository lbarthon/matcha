import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';

class User extends Component {

  state = {
    username: '',
    email: ''
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    fetch('/api/user/' + id)
    .then(response => {
      response.json().then(json => {
        if (response.ok) {
          json = json.response;
          this.setState({
            username: json.username,
            email: json.email
          })
        }
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.username}<br/>
        {this.state.email}
      </React.Fragment>
    )
  }
}
export default withAllHOC(User);
