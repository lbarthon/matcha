import React, { Component } from 'react';
import { alert } from '../utils/alert';
import { withLocalesHOC } from '../utils/locales';
import M from 'materialize-css'

class NotFound extends Component {

  componentDidMount() {
    document.title = '404 not found';
  }

  render() {
    const {locale} = this.props.locales;
    return (
      <h3 className="center">404 NOT FOUND</h3>
    )
  }
}

export default withLocalesHOC(NotFound);
