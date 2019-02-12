import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import { AlertContainer, cleanAlerts } from './utils/Alert';

class App extends Component {

  componentWillMount() {
    console.log('mount');
  }

  componentWillUpdate() {
    // effacer toutes les alerts au changement de page
    cleanAlerts();
    console.log('update');
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="container">
          <AlertContainer />
          <Switch>
              <Route exact path="/" />
              <Route path="/register" render={() => <Register />}/>
              <Route path="/login" component={Login} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
