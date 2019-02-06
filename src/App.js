import React, { Component } from 'react';
import './materialize.css';
import { Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';


class App extends Component {

  constructor() {
    super();
    localStorage.setItem('createAlert', this.createAlert);
  }

  state = {
    alert: 'ok'
  }

  createAlert = (msg) => {
    this.setState({ alert: msg });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />
        <div className="container">
          <h3>{this.state.alert}</h3>
          <Switch>
              <Route exact path="/" />
              <Route path="/register" render={() => <Register createAlert={this.createAlert} />}/>
              <Route path="/login" component={Login} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
