import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';
import '../css/notification.css'
import { notify } from '../utils/alert';

class Notifications extends Component {

  getDate = (str) => {
    let d = new Date(str);
    return  d.getDate() + '/' + d.getMonth() + 1 + '/' +  d.getFullYear();
  }

  getIcon = (notif) => {
    switch (notif.type) {
      case 'unmatch':
        return 'sentiment_dissatisfied';
      case 'message':
        return 'chat';
      case 'match':
        return 'people';
      case 'like':
        return 'thumb_up';
      case 'visit':
        return 'touch_app';
    }
  }

  componentDidMount() {
    document.title = 'Notifications';
  }

  render() {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        {this.props.notifs.notifications.map(notif => {
          return (
            <div className="notification" onMouseEnter={() => this.props.notifs.setAsRead(notif.id)}>
              <i className="material-icons notification-icon blue white-text">
                {this.getIcon(notif)}
                {!notif.read && <div className="new-icon"></div>}
              </i>
              <span><Link to={'/user/' + notif.from_id}><b>{notif.username}</b></Link> {locale.notification[notif.type]}</span>
              <em>{this.getDate(notif.create_time)}</em>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default withAllHOC(Notifications);
