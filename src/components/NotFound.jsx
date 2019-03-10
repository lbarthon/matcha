import React, { Component } from 'react';
import parseForm from '../utils/parseForm';
import { notify } from '../utils/alert';
import { withLocalesHOC } from '../utils/locales';
import M from 'materialize-css'

class NotFound extends Component {

  componentDidMount() {
    document.title = '404 not found';
  }

  render() {
    const {locale} = this.props.locales;
    return (
      <h6>404 NOT FOUND</h6>
    )
  }
}

export default withLocalesHOC(NotFound);
