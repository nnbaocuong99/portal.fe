import React from "react";
import { Switch } from "react-router-dom";
import { ORGANIZATION_MASTER_ROUTE } from "config/route-consts";

import OrganizationTreeMaster from "./OrganizationTreeMaster/OrganizationTreeMaster";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import { authorizationService } from "services/authorization-service";

function OrganizationTreeView() {
  const { auth } = authorizationService.useAuthorizedRoute();

  return (
    <Switch>
      <ProtectedRoute
        path={ORGANIZATION_MASTER_ROUTE}
        key={ORGANIZATION_MASTER_ROUTE}
        component={OrganizationTreeMaster}
        auth={auth(ORGANIZATION_MASTER_ROUTE)}
      />
    </Switch>
  );
}

export { OrganizationTreeMaster };
export default OrganizationTreeView;
