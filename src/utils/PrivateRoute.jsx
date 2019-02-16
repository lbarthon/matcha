import React from 'react';
import { Route, Redirect } from 'react-router'

function PrivateRoute ({component: Component, canAccess, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => canAccess === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  );
}

export default PrivateRoute;
