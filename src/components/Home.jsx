import React, { Component } from 'react';
import { withAllHOC } from '../utils/allHOC';

class Home extends Component {

  componentDidMount () {
    const {locale} = this.props.locales;
    document.title = locale.title.home;
  }

  render() {
    return (
      <React.Fragment>
      {this.props.currentUser.logged &&
        <h4>Bienvenue {this.props.currentUser.username}</h4>
      }
      </React.Fragment>
    )
  }
}

export default withAllHOC(Home);
