import React from 'react';
import { Route, Redirect } from 'react-router'
import { withCurrentUserHOC } from '../currentUser';

function AdminRoute ({component: Component, ...rest}) {
  const { currentUser } = rest;
  return (
    <Route
      {...rest}
      render={(props) => currentUser.admin
        ? <Component {...props} />
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  );
}

export default withCurrentUserHOC(AdminRoute);
