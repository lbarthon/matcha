import React, { Component } from 'react';
import { withAllHOC } from '../../utils/allHOC';
import '../../css/match.css';
import { Link, BrowserRouter } from 'react-router-dom';

class MatchUser extends Component {

  render() {
    if (this.props.user === undefined) return null;
    const { username, age, picture, id} = this.props.user;
    return (
      <React.Fragment>
        <div className="col s4 m3">
          <Link to={'/user/' + id}>
            <div className="match-card z-depth-2" style={{backgroundImage: 'url("/pictures/user/' + picture + '")'}}>
              <span>{username}</span>
              <small>{age}</small>
            </div>
          </Link>
        </div>
      </React.Fragment>
    )
  }
}
export default withAllHOC(MatchUser);
