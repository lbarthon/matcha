import React from 'react';
import req from './req';

export const CurrentUserContext = React.createContext({
  username: '',
  id: undefined,
  logged: undefined,
  getCurrentUser: () => {}
});

export class CurrentUserProvider extends React.Component {

  state = {
    username: '',
    id: undefined,
    logged: undefined,
    getCurrentUser: (callback) => {
      req('/api/logged')
      .then(res => {
        if (localStorage.getItem('csrf') != res.csrf)
          localStorage.setItem('csrf', res.csrf);
        if (res.username !== undefined) {
          if (this.state.logged !== true) {
            this.setState({
              logged: true,
              username: res.username,
              id: res.uid,
            });
          }
        } else {
          if (this.state.logged !== false) {
            this.setState({
              logged: false,
            });
          }
        }
      })
      .catch(err => {
        alert('error', this.props.locales.idParser(err));
      })
      if (callback) {
        callback();
      }
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
