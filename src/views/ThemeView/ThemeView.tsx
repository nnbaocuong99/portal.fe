import { THEME_MASTER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import ThemeMaster from "./ThemeMaster/ThemeMaster";

function ThemeView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={THEME_MASTER_ROUTE}
        key={THEME_MASTER_ROUTE}
        component={ThemeMaster}
        auth={auth(THEME_MASTER_ROUTE)}
      />
    </Switch>
  );
}

export { ThemeMaster };
export default ThemeView;
