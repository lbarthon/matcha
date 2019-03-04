import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';

class Notifications extends Component {

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
      null
    );
  }
}

export default withAllHOC(Notifications);
