import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';

class Notifications extends Component {

  state = {
    notifications: [
      {
        type: 'message',
        read: 0,
      }
    ]
  }

  getNotifications = () => {
  }

  componentWillMount() {
    this.getNotifications();
  }

  componentDidMount() {
    document.title = 'Notifications';
  }

  render() {
    return (
      <React.Fragment>
        {this.state.notifications.map(notification => {
          <div></div>
        })}
      </React.Fragment>
    );
  }
}

export default withAllHOC(Notifications);
