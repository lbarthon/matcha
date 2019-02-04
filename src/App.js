import React, { Component } from 'react';
import { Provider } from 'react-redux';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider value="test">
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            lbarthon ur god
          </p>
        </header>
      </div>
      </Provider>
    );
  }
}

export default App;
