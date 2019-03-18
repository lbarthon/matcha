import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';
import Login from './login/Login';
import User from './user/User';

class Home extends Component {

  componentDidMount () {
    const {locale} = this.props.locales;
    document.title = 'Matcha';
  }

  render() {
    return (
      <React.Fragment>
      {this.props.currentUser.logged &&
        <div>
          <h2 className="center">{this.props.locales.locale.welcome}</h2>
          <User match={{params: {id: this.props.currentUser.id }}}/>
        </div>
      }
      {!this.props.currentUser.logged &&
        <Login />
      }
      </React.Fragment>
    )
  }
}

export default withAllHOC(Home);
