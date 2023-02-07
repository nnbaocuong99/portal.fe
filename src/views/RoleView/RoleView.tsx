import { ROLE_DETAIL_ROUTE, ROLE_MASTER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import RoleDetail from "./RoleDetail/RoleDetail";
import RoleMaster from "./RoleMaster/RoleMaster";

function RoleView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={ROLE_MASTER_ROUTE}
        key={ROLE_MASTER_ROUTE}
        component={RoleMaster}
        auth={auth(ROLE_MASTER_ROUTE)}
      />
      <ProtectedRoute
        path={ROLE_DETAIL_ROUTE}
        key={ROLE_DETAIL_ROUTE}
        component={RoleDetail}
        auth={auth(ROLE_DETAIL_ROUTE)}
      />
    </Switch>
  );
}

export { RoleMaster, RoleDetail };
export default RoleView;
