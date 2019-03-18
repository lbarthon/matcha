import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAllHOC } from '../utils/allHOC';
import M from 'materialize-css';
import '../css/notification.css'
import { alert } from '../utils/alert';
import dateFormat from 'dateformat';

class Notifications extends Component {

  state = {
    length: 20,
    isLoading: false
  }

  constructor(props) {
    super(props);

    window.onscroll = () => {
      const { isLoading } = this.state;
      if (isLoading) return;
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        this.setStateCheck({ isLoading: true }, () => {
          this.setStateCheck({
            length: this.state.length + 20,
            isLoading: false
          });
        });
      }
    }
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

  _isMounted = false;
  setStateCheck = (state, callback) => {
    if (this._isMounted)
      this.setState(state, callback);
  }

  componentDidMount() {
    document.title = 'Notifications';
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { locale } = this.props.locales;
    return (
      <React.Fragment>
        <div className="mt-10 mb-10">
          <button className="btn waves-effect waves-light" onClick={this.props.notifs.readAll}>{locale.notification.read_all}</button>
        </div>
        {this.props.notifs.notifications.map((notif, i) => {
          if (i >= this.state.length) return null;
          return (
            <div key={notif.id} className="notification clearfix" onMouseEnter={() => this.props.notifs.setAsRead(notif.id)}>
              <i className="material-icons notification-icon blue white-text">
                {this.getIcon(notif)}
                {!notif.read && <div className="new-icon"></div>}
              </i>
              <span><Link to={'/user/' + notif.from_id}><b>{notif.username}</b></Link> {locale.notification[notif.type]}</span>
              <em>{dateFormat(new Date(notif.create_time), 'd/mm/yyyy HH:MM')}</em>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default withAllHOC(Notifications);
