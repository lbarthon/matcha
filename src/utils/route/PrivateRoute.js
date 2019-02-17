import React from 'react';
import { Route, Redirect } from 'react-router'
import { withCurrentUserHOC } from '../currentUser';

function PrivateRoute ({component: Component, ...rest}) {
  const { currentUser } = rest;
  return (
    <Route
      {...rest}
      render={(props) => currentUser.logged
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  );
}

export default withCurrentUserHOC(PrivateRoute);
