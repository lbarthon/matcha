import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AlertContainer, cleanAlerts } from './utils/alert';
import { withAllHOC } from './utils/allHOC';
import UnloggedRoute from './utils/route/UnloggedRoute';
import PrivateRoute from './utils/route/PrivateRoute';
import AdminRoute from './utils/route/AdminRoute';
import Navbar from './components/navbar/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/login/Login';
import Update from './components/update/Update';
import Upload from './components/Upload';
import User from './components/user/User';
import Notifications from './components/Notifications';
import WindowChat from './components/chat/window/WindowChat';
import Chat from './components/chat/Chat';
import NotFound from './components/NotFound';
import Match from './components/match/Match';
import Admin from './components/admin/Admin';
import Resetpw from './components/Resetpw';
import Confirm from './components/Confirm';
import './css/upload.css';
import './css/alert.css';
import './css/style.css';
import { withRouter } from "react-router-dom";

class App extends Component {

  componentWillMount() {
    console.log('app_mount');
  }

  componentWillUpdate() {
    console.log('app_update');
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      console.log("Route change!, reload user");
      this.props.currentUser.getCurrentUser();
    }
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />
        <AlertContainer />
        <div className="container" style={{margin: '20px auto'}}>
          <Switch>
            <Route exact path="/" component={Home} />
            <UnloggedRoute path="/register" component={Register} />
            <UnloggedRoute path="/login" component={Login} />
            <UnloggedRoute path="/resetpw/:link" component={Resetpw} />
            <UnloggedRoute path="/confirm/:link" component={Confirm} />
            <PrivateRoute path="/match" component={Match} />
            <PrivateRoute path="/update" component={Update} />
            <PrivateRoute path="/upload" component={Upload} />
            <PrivateRoute path="/user/:id" component={User} />
            <PrivateRoute path="/notifications" component={Notifications} />
            <PrivateRoute path="/chat" component={Chat} />
            <AdminRoute path="/admin" component={Admin} />
            <Route path='*' exact={true} component={NotFound} />
          </Switch>
        </div>
        {this.props.currentUser.logged && <WindowChat />}
      </React.Fragment>
    );
  }
}

export default withRouter(withAllHOC(App));
