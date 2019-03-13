import React from 'react';
import { withSocketHOC } from './socket';
import { withLocalesHOC } from './locales';
import { withCurrentUserHOC } from './currentUser';
import { notify } from './alert';
import req from './req';

export const NotificationsContext = React.createContext({
  count: 0,
  notifications : [],
  getNotifications: () => {}
});

export class _NotificationsProvider extends React.Component {

  state = {
    count: 0,
    notifications : [],
    getNotifications : () => {
      req('/api/notification/get')
      .then(res => {
        this.setState({notifications: res}, () => {
          this.countNotifications();
        });
      })
      .catch(err => {
        notify('error', this.props.locales.idParser(err));
      })
    },
    setAsRead : (id) => {
      const { notifications, count } = this.state;
      let i = 0;
      for (i = 0; i < notifications.length; i++) {
        if (notifications[i].id == id)
          break;
      }
      if (notifications[i].read == 0) {
        let copy = notifications.slice();
        copy[i].read = 1;
        this.setState({notifications: copy});
        req('/api/notification/read/' + id)
        .catch(err => {
          notify('error', this.props.locales.idParser(err));
        })
      }
    }
  }

  countNotifications = () => {
    const { notifications, count } = this.state;
    let i = 0;
    notifications.map(notif => {
      if (notif.read == 0)
        i++;
    });
    if (i != count)
      this.setState({count: i});
  }

  componentWillUpdate() {
    this.countNotifications();
  }

  componentWillMount() {
    const { socket } = this.props;
    const { currentUser } = this.props;
    if (currentUser.logged === true) {
      this.state.getNotifications();
      socket.on('new_notification', () => {
        this.state.getNotifications();
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { socket } = this.props;
    if (nextProps.currentUser.logged === true) {
      this.state.getNotifications();
      socket.on('new_notification', () => {
        this.state.getNotifications();
      });
    }
  }

  render() {
    return (
      <NotificationsContext.Provider value={this.state}>
        {this.props.children}
      </NotificationsContext.Provider>
    )
  }
}

export const NotificationsProvider = withCurrentUserHOC(withLocalesHOC(withSocketHOC(_NotificationsProvider)));

export const withNotificationsHOC = (Component) => {
  class HOC extends React.Component {
    render() {
      return <Component {...this.props} notifs={this.context} />
    }
  }
  HOC.contextType = NotificationsContext;
  return HOC;
}
