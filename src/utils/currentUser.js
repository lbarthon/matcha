import React from 'react';

export const CurrentUserContext = React.createContext({
  username: '',
  logged: false,
  getCurrentUser: () => {}
});

export class CurrentUserProvider extends React.Component {

  state = {
    username: '',
    logged: false,
    getCurrentUser: () => {
      fetch('/api/logged', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
      })
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            if (json['response'] !== false) {
              this.setState({username: json['response']});
              this.setState({logged: true});
            } else {
              this.setState({logged: false});
            }
          })
        } else {
          throw Error(response.statusText);
        }
      })
      .catch(error => {
        console.log(error);
      });
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
