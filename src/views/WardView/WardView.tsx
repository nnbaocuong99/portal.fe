import { WARD_MASTER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import WardMaster from "./WardMaster/WardMaster";

function WardView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={WARD_MASTER_ROUTE}
        key={WARD_MASTER_ROUTE}
        component={WardMaster}
        auth={auth(WARD_MASTER_ROUTE)}
      />
    </Switch>
  );
}

export { WardMaster };
export default WardView;
