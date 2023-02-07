import { NATION_MASTER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import NationMaster from "./NationMaster/NationMaster";

function NationView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={NATION_MASTER_ROUTE}
        key={NATION_MASTER_ROUTE}
        component={NationMaster}
        auth={auth(NATION_MASTER_ROUTE)}
      />
    </Switch>
  );
}

export { NationMaster };
export default NationView;
