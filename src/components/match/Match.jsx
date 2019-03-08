import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/alert';
import { withLocalesHOC } from '../utils/locales';
import M from 'materialize-css'

class NotFound extends Component {

  componentDidMount() {

  }

  render() {
    return (
      <div></div>
    )
  }
}

export default withLocalesHOC(NotFound);
