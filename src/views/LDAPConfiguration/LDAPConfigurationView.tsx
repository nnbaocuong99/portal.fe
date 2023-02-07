import { LDAP_CONFIGURATION_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import LDAPConfigurationDetail from "./LDAPConfigurationDetail/LDAPConfigurationDetail";

function LDAPConfigurationView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={LDAP_CONFIGURATION_ROUTE}
        key={LDAP_CONFIGURATION_ROUTE}
        component={LDAPConfigurationDetail}
        auth={auth(LDAP_CONFIGURATION_ROUTE)}
      />
    </Switch>
  );
}

export { LDAPConfigurationDetail };
export default LDAPConfigurationView;
