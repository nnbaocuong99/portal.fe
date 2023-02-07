import { DISTRICT_MASTER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import DistrictMaster from "./DistrictMaster/DistrictMaster";

function DistrictView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={DISTRICT_MASTER_ROUTE}
        key={DISTRICT_MASTER_ROUTE}
        component={DistrictMaster}
        auth={auth(DISTRICT_MASTER_ROUTE)}
      />
    </Switch>
  );
}

export { DistrictMaster };
export default DistrictView;
