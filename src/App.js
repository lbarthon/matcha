import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import { AlertContainer, cleanAlerts } from './utils/alert';
import { LocalesProvider } from './utils/locales';
import { withCurrentUserHOC } from './utils/currentUser';
import PrivateRoute from './utils/PrivateRoute';

class App extends Component {

  componentWillMount() {
    console.log('APP mount');
  }

  componentWillUpdate() {
    console.log('APP update');
    // effacer toutes les alerts au changement de page
    // cleanAlerts();
  }

  render() {
    const { logged } = this.props.currentUser;
    console.log('APP render');
    return (
      <React.Fragment>
        <LocalesProvider>
          <Navbar />
          <div className="container">
            <AlertContainer />
            <Switch>
                <Route exact path="/" />
                <Route path="/register" render={() => <Register />}/>
                <PrivateRoute canAccess={!logged} path="/login" component={Login} />
            </Switch>
          </div>
        </LocalesProvider>
      </React.Fragment>
    );
  }
}

export default withCurrentUserHOC(App);
