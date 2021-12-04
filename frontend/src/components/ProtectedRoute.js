import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Spinner from "./Spinner";

const ProtectedRoute = ({isLoggedIn, path, children, isChecking}) => {
  return (
    <Route path={path} exact>
      { isChecking ? (
        <main>
          <Spinner />
        </main>
      ) : (
        isLoggedIn ? children : <Redirect to="/sign-in" />
      )}
    </Route>
)};

export default ProtectedRoute;
