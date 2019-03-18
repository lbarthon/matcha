import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import Login from './login/Login';

class Home extends Component {

  componentDidMount () {
    const {locale} = this.props.locales;
    document.title = 'Matcha';
  }

  render() {
    return (
      <React.Fragment>
      {this.props.currentUser.logged &&
        <h4>Bienvenue {this.props.currentUser.username}</h4>
      }
      {!this.props.currentUser.logged &&
        <Login />
      }
      </React.Fragment>
    )
  }
}

export default withAllHOC(Home);
