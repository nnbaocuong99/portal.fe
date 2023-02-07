import { SITE_MASTER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import SiteMaster from "./SiteMaster/SiteMaster";

function SiteView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={SITE_MASTER_ROUTE}
        key={SITE_MASTER_ROUTE}
        component={SiteMaster}
        auth={auth(SITE_MASTER_ROUTE)}
      />
    </Switch>
  );
}

export { SiteMaster };
export default SiteView;
