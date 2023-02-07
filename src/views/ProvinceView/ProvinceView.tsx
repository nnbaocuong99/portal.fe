import { PROVINCE_MASTER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import ProvinceMaster from "./ProvinceMaster/ProvinceMaster";

function ProvinceView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={PROVINCE_MASTER_ROUTE}
        key={PROVINCE_MASTER_ROUTE}
        component={ProvinceMaster}
        auth={auth(PROVINCE_MASTER_ROUTE)}
      />
    </Switch>
  );
}

export { ProvinceMaster };
export default ProvinceView;
