import React from 'react';

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
      fetch('/api/logged')
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json.success !== false) {
              if (this.state.logged !== true) {
                this.setState({
                  logged: true,
                  username: json.success.username,
                  id: json.success.uid,
                  csrf: json.success.csrf
                });
              }
            } else {
              if (this.state.logged !== false)
                this.setState({
                  logged: false, csrf: json.success.csrf
                });
            }
          })
        } else {
          console.log(response);
          throw Error(response.statusText);
        }
      })
      .catch(error => { console.log(error); });
      if (callback)
        callback();
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
