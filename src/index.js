import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { CurrentUserProvider } from './utils/currentUser'
import { LocalesProvider } from './utils/locales'
import { SocketProvider } from './utils/socket'
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <BrowserRouter>
    <CurrentUserProvider>
      <LocalesProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </LocalesProvider>
    </CurrentUserProvider>
  </BrowserRouter>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
