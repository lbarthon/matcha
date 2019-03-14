import React from 'react';
import req from './req';

export const CurrentUserContext = React.createContext({
  username: '',
  id: undefined,
  logged: undefined,
  admin: false,
  getCurrentUser: () => {}
});

export class CurrentUserProvider extends React.Component {

  state = {
    username: '',
    id: undefined,
    logged: undefined,
    admin: false,
    getCurrentUser: (callback) => {
      req('/api/logged')
      .then(res => {
        if (localStorage.getItem('csrf') != res.csrf)
          localStorage.setItem('csrf', res.csrf);
        if (res.username !== undefined) {
          if (this.state.logged !== true || this.state.username != res.username || this.state.admin != res.perm_level) {
            this.setState({
              logged: true,
              username: res.username,
              id: res.uid,
              admin: res.perm_level == 1 ? true : false
            });
          }
        } else if (this.state.logged !== false) {
          this.setState({
            logged: false
          });
        }
        if (callback) callback();
      })
      .catch(err => {
        alert('error', this.props.locales.idParser(err));
        if (callback) callback();
      })
    }
  }

  componentWillMount() {
    this.state.getCurrentUser();
  }

  render() {
    if (this.state.logged === undefined) return null;
    return (
      <CurrentUserContext.Provider value={this.state}>
        {this.props.children}
      </CurrentUserContext.Provider>
    )
  }
}

export const withCurrentUserHOC = (Component) => {
  class HOC extends React.Component {
    render() {
      return <Component {...this.props} currentUser={this.context} />
    }
  }
  HOC.contextType = CurrentUserContext;
  return HOC;
}
