import React, { Component } from 'react';
import { withAllHOC } from '../../utils/allHOC';

class MatchUser extends Component {

  render() {
    if (this.props.user === undefined) return null;
    const { locale } = this.props.locales;
    const { username, tags, description, birthdate } = this.props.user;
    return (
      <React.Fragment>
        <p>{username}</p>
        <p>{description}</p>
        <p>{birthdate}</p>
        <p>{tags.join(", ")}</p>
      </React.Fragment>
    )
  }
}
export default withAllHOC(MatchUser);
