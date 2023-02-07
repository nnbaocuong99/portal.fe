import { INIT_MASTER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import InitMaster from "./InitMaster/InitMaster";

function InitView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={INIT_MASTER_ROUTE}
        key={INIT_MASTER_ROUTE}
        component={InitMaster}
        auth={auth(INIT_MASTER_ROUTE)}
      />
    </Switch>
  );
}

export { InitMaster };
export default InitView;
