import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { CurrentUserProvider } from './utils/currentUser';
import { LocalesProvider } from './utils/locales';
import { SocketProvider } from './utils/socket';
import { NotificationsProvider } from './utils/notifications';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <CurrentUserProvider>
      <LocalesProvider>
        <SocketProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </SocketProvider>
      </LocalesProvider>
    </CurrentUserProvider>
  </BrowserRouter>
  , document.getElementById('root')
);
