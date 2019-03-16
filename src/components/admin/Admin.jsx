import React, { Component } from 'react';
import { alert } from '../../utils/alert';
import { withAllHOC } from '../../utils/allHOC';
import req from '../../utils/req';
import Report from './Report';

class Home extends Component {

  state = {
    length: 20,
    isLoading: false,
    reports: []
  }

  constructor(props) {
    super(props);

    window.onscroll = () => {
      const { isLoading } = this.state;
      if (isLoading) return;
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        this.setState({ isLoading: true }, () => {
          this.setState({
            length: this.state.length + 20,
            isLoading: false
          });
        });
      }
    }
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
    const { reports, length } = this.state;
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        <h4>Admin page pour mossieu {this.props.currentUser.username}</h4>
        {reports.length == 0 && <p>{locale.admin.no_report}</p>}
        {reports.map((value, i) => {
          if (i >= length) return null;
          return <Report key={i} report={value} onDelete={this.fetchReports} />
        })}
      </React.Fragment>
    )
  }
}

export default withAllHOC(Home);
