import React, { Component } from 'react';
import './materialize.css';
import { Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';


class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="container">
          <Switch>
              <Route exact path="/" />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
