import React, { Component } from 'react';
import { alert } from '../utils/alert';
import { withAllHOC } from '../utils/allHOC';
import req from '../utils/req';

class Confirm extends Component {

  confirm = (link) => {
    req('/api/confirm', {link: link})
    .then(res => {
      alert('success', this.props.locales.idParser(res));
      this.props.history.push('/login');
    })
    .catch(err => {
      alert('error', this.props.locales.idParser(err));
    })
  }

  componentWillMount() {
    this.confirm(this.props.match.params.link);
  }

  render() {
    return null;
  }
}

export default withAllHOC(Confirm);
