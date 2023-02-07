import App from "app/App";
import { userRoutes } from "config/routes";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import authenticationService from "services/authentication-service";
import * as Cookie from "js-cookie";

export const PrivateRoute = ({ ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const currentUser = authenticationService.currentUserValue;
      const token = Cookie.get("Token");
      if (!currentUser && !token) {
        return (
          <Redirect
            to={{
              pathname: `/login`,
              state: { from: props.location },
            }}
          />
        );
      }
      return (
        <React.Suspense fallback={null}>
          <App>
            <Switch>
              <Route
                exact
                path={`/`}
                render={() => {
                  return <Redirect to={`/landing-page`} />;
                }}
              />
              {userRoutes.map(({ path, component: Component }) => (
                <Route
                  key={path}
                  path={path}
                  render={(props) => {
                    return <Component />;
                  }}
                ></Route>
              ))}
            </Switch>
          </App>
        </React.Suspense>
      );
    }}
  />
);
