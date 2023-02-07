import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./i18n/i18n";
import { Provider } from "react-redux";
import WebFont from "webfontloader";
import store from "./store";
import { PrivateRoute } from "pages/Authentication/PrivateRoute";
import Login from "pages/Authentication/Login/Login";
import { LANDING_PAGE_ROUTE } from "config/route-consts";
import LandingPageView from "views/LandingPageView/NewLandingPage";
import { SignalRContext } from "app/AppContext";
import signalRService from "services/signalr-service";
import ForbidentView from "pages/ForbidentView/ForbidentView";
import * as Cookie from "js-cookie";

WebFont.load({
  google: {
    families: ["Inter"],
  },
});

const app = (
  <Fragment>
    <Provider store={store}>
      <SignalRContext.Provider value={signalRService}>
        <React.Suspense fallback={null}>
          <BrowserRouter basename="/">
            <Switch>
              <Route
                exact
                path={`/login`}
                render={() => {
                  if (Cookie.get("Token")) {
                    return <Redirect to={LANDING_PAGE_ROUTE} />;
                  } else {
                    return <Login />;
                  }
                }}
              />
              <Route exact path={`/403`} component={ForbidentView} />
              <Route
                exact
                path={LANDING_PAGE_ROUTE}
                component={LandingPageView}
              />
              <PrivateRoute path="/" />
            </Switch>
          </BrowserRouter>
        </React.Suspense>
      </SignalRContext.Provider>
    </Provider>
  </Fragment>
);

ReactDOM.render(app, document.getElementById("root"));
serviceWorker.unregister();
