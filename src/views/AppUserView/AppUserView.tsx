import {
  APP_USER_DETAIL_ROUTE,
  APP_USER_MASTER_ROUTE,
} from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import AppUserDetail from "./AppUserDetail/AppUserDetail";
import AppUserMaster from "./AppUserMaster/AppUserMaster";

function AppUserView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={APP_USER_MASTER_ROUTE}
        key={APP_USER_MASTER_ROUTE}
        component={AppUserMaster}
        auth={auth(APP_USER_MASTER_ROUTE)}
      />
      <ProtectedRoute
        path={APP_USER_DETAIL_ROUTE}
        key={APP_USER_DETAIL_ROUTE}
        component={AppUserDetail}
        auth={auth(APP_USER_DETAIL_ROUTE)}
      />
    </Switch>
  );
}

export { AppUserMaster, AppUserDetail };
export default AppUserView;
