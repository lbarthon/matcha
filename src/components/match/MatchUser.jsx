import React, { Component } from 'react';
import { withAllHOC } from '../../utils/allHOC';

class MatchUser extends Component {

  render() {
    if (this.props.user === undefined) return null;
    const { locale } = this.props.locales;
    const { username, sex, description, birthdate } = this.props.user;
    return (
      <React.Fragment>
        <p>{username}</p>
        <p>{description}</p>
        <p>{birthdate}</p>
      </React.Fragment>
    )
  }
}
export default withAllHOC(MatchUser);
