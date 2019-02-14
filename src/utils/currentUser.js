import React from 'react';

export const CurrentUserContext = React.createContext({
  username: '',
  logged: '',
  getCurrentUser: () => {}
});

export class CurrentUserProvider extends React.Component {

  state = {
    username: undefined,
    logged: 0,
    getCurrentUser: () => {
      fetch('/api/logged', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            this.setState({username: json['response']});
            if (json['response'] !== false)
              this.setState({logged: 1});
            else
              this.setState({logged: 0});
          })
        }
      })
    }
  }

  componentWillMount() {
    this.state.getCurrentUser();
  }

  render() {
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
