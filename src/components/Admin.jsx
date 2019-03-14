import React, { Component } from 'react';
import { alert } from '../utils/alert';
import { withAllHOC } from '../utils/allHOC';
import req from '../utils/req';

class Home extends Component {

  fetchReports = () => {
    req('/api/report/get')
    .then(res => {
        
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    });
  }

  componentWillMount = () => {
    this.fetchReports();
  }

  componentDidMount = () => {
    const { locale } = this.props.locales;
    document.title = locale.title.admin;
  }

  render() {
    return (
      <React.Fragment>
        <h4>Admin page pour mossieu {this.props.currentUser.username}</h4>
      </React.Fragment>
    )
  }
}

export default withAllHOC(Home);
