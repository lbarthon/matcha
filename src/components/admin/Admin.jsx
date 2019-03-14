import React, { Component } from 'react';
import { alert } from '../../utils/alert';
import { withAllHOC } from '../../utils/allHOC';
import req from '../../utils/req';
import Report from './Report';

class Home extends Component {

  state = {
    reports: []
  }

  fetchReports = () => {
    req('/api/report/get')
    .then(res => {
      this.setState({ reports: res });
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
    const { reports } = this.state;
    return (
      <React.Fragment>
        <h4>Admin page pour mossieu {this.props.currentUser.username}</h4>
        {reports.map(value => {
          return <Report report={value} onDelete={this.fetchReports} />
        })}
      </React.Fragment>
    )
  }
}

export default withAllHOC(Home);
