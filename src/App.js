import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AlertContainer, cleanAlerts } from './utils/alert';
import { withAllHOC } from './utils/allHOC';
import UnloggedRoute from './utils/route/UnloggedRoute';
import PrivateRoute from './utils/route/PrivateRoute';
import Navbar from './components/partials/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Update from './components/Update';
import Upload from './components/Upload';
import User from './components/User';
import Notifications from './components/Notifications';
import Chat from './components/Chat';
import NotFound from './components/NotFound';
import './css/upload.css';
import './css/alert.css';
import './css/style.css';

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
        <Navbar />
        <div className="container">
          <AlertContainer />
          <Switch>
            <Route exact path="/" component={Home}/>
            <UnloggedRoute path="/register" component={Register}/>
            <UnloggedRoute path="/login" component={Login}/>
            <PrivateRoute path="/update" component={Update}/>
            <PrivateRoute path="/upload" component={Upload}/>
            <PrivateRoute path="/user/:id" component={User}/>
            <PrivateRoute path="/chat" component={Chat}/>
            <PrivateRoute path="/chat/:id" component={Chat}/>
            <PrivateRoute path="/notifications" component={Notifications}/>
            <Route path='*' exact={true} component={NotFound} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default withAllHOC(App);
