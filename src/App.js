import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AlertContainer, cleanAlerts } from './utils/alert';
import { LocalesProvider } from './utils/locales';
import { withCurrentUserHOC } from './utils/currentUser';
import UnloggedRoute from './utils/route/UnloggedRoute';
import PrivateRoute from './utils/route/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Update from './components/Update';

class App extends Component {

  componentWillMount() {
    console.log('APP mount');
  }

  componentWillUpdate() {
    this.props.currentUser.getCurrentUser();
    console.log('APP update');
    // effacer toutes les alerts au changement de page
    // cleanAlerts();
  }

  render() {
    console.log('APP render');
    return (
      <React.Fragment>
        <LocalesProvider>
          <Navbar />
          <div className="container">
            <AlertContainer />
            <Switch>
                <Route exact path="/" component={Home} />
                <UnloggedRoute path="/register" component={Register}/>
                <UnloggedRoute path="/login" component={Login}/>
                <PrivateRoute path="/update" component={Update}/>
            </Switch>
          </div>
        </LocalesProvider>
      </React.Fragment>
    );
  }
}

export default withCurrentUserHOC(App);
