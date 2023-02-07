import { join } from "path";

export const ROOT_ROUTE: string = process.env.PUBLIC_URL;
export const LOGIN_ROUTE: string = "/login";
export const LOGOUT_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/logout"
  : "/logout";
export const FORBIDENT_ROUTE: string = "/403";
export const NOT_FOUND_ROUTE: string = "/404";
export const LANDING_PAGE_ROUTE: string = "/landing-page";

export const TYPOGRAPHY_PAGE_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/typography")
  : "/typography";
export const COLOR_PAGE_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/color")
  : "/color";
export const SIDE_BAR_PAGE_ROUTE: string = ROOT_ROUTE
  ? join(ROOT_ROUTE + "/side-bar")
  : "/side-bar";

export const THEME_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/theme"
  : "/theme";
export const THEME_MASTER_ROUTE: string = join(THEME_ROUTE, "theme-master");
export const APP_USER_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/app-user"
  : "/app-user";
export const APP_USER_MASTER_ROUTE: string = join(
  APP_USER_ROUTE,
  "app-user-master"
);
export const APP_USER_DETAIL_ROUTE: string = join(
  APP_USER_ROUTE,
  "app-user-detail"
);

export const ORGANIZATION_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/organization"
  : "/organization";
export const ORGANIZATION_MASTER_ROUTE: string = join(
  ORGANIZATION_ROUTE,
  "organization-master"
);
export const ORGANIZATION_DETAIL_ROUTE: string = join(
  ORGANIZATION_ROUTE,
  "organization-detail"
);

export const ROLE_ROUTE: string = ROOT_ROUTE ? ROOT_ROUTE + "/role" : "/role";
export const ROLE_MASTER_ROUTE: string = join(ROLE_ROUTE, "role-master");
export const ROLE_DETAIL_ROUTE: string = join(ROLE_ROUTE, "role-detail");

export const SITE_ROUTE: string = ROOT_ROUTE ? ROOT_ROUTE + "/site" : "/site";
export const SITE_MASTER_ROUTE: string = join(SITE_ROUTE, "site-master");
export const PERMISSION_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/permission"
  : "/permission";
export const PERMISSION_MASTER_ROUTE: string = join(
  PERMISSION_ROUTE,
  "permission-master"
);
export const USER_NOTIFICATION_ROUTE: string = "/portal/user-notification";

export const DISTRICT_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/district"
  : "/district";
export const DISTRICT_MASTER_ROUTE: string = join(
  DISTRICT_ROUTE,
  "district-master"
);

export const PROVINCE_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/province"
  : "/province";
export const PROVINCE_MASTER_ROUTE: string = join(
  PROVINCE_ROUTE,
  "province-master"
);

export const WARD_ROUTE: string = ROOT_ROUTE ? ROOT_ROUTE + "/ward" : "/ward";
export const WARD_MASTER_ROUTE: string = join(WARD_ROUTE, "ward-master");
export const NATION_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/nation"
  : "/nation";
export const NATION_MASTER_ROUTE: string = join(NATION_ROUTE, "nation-master");

//Workflow
export const WORKFLOW_DEFINITION_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/workflow-definition"
  : "/workflow-definition";
export const WORKFLOW_DEFINITION_MASTER_ROUTE: string = join(
  WORKFLOW_DEFINITION_ROUTE,
  "workflow-definition-master"
);
export const WORKFLOW_DEFINITION_PREVIEW_ROUTE: string = join(
  WORKFLOW_DEFINITION_ROUTE,
  "workflow-definition-preview"
);
export const WORKFLOW_DEFINITION_DETAIL_ROUTE: string = join(
  WORKFLOW_DEFINITION_ROUTE,
  "workflow-definition-detail"
);

export const WORKFLOW_DIRECTION_CONDITION_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/workflow-direction-condition"
  : "/workflow-direction-condition";
export const WORKFLOW_DIRECTION_CONDITION_MASTER_ROUTE: string = join(
  WORKFLOW_DIRECTION_CONDITION_ROUTE,
  "workflow-direction-condition-master"
);

export const WORKFLOW_DIRECTION_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/workflow-direction"
  : "/workflow-direction";
export const WORKFLOW_DIRECTION_MASTER_ROUTE: string = join(
  WORKFLOW_DIRECTION_ROUTE,
  "workflow-direction-master"
);
export const WORKFLOW_DIRECTION_DETAIL_ROUTE: string = join(
  WORKFLOW_DIRECTION_ROUTE,
  "workflow-direction-detail"
);
export const WORKFLOW_DIRECTION_PREVIEW_ROUTE: string = join(
  WORKFLOW_DIRECTION_ROUTE,
  "workflow-direction-preview"
);
export const WORKFLOW_OPERATOR_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/workflow-operator"
  : "/workflow-operator";
export const WORKFLOW_OPERATOR_MASTER_ROUTE: string = join(
  WORKFLOW_OPERATOR_ROUTE,
  "workflow-operator-master"
);

export const WORKFLOW_PARAMETER_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/workflow-parameter"
  : "/workflow-parameter";
export const WORKFLOW_PARAMETER_MASTER_ROUTE: string = join(
  WORKFLOW_PARAMETER_ROUTE,
  "workflow-parameter-master"
);

export const WORKFLOW_PARAMETER_TYPE_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/workflow-parameter-type"
  : "/workflow-parameter-type";
export const WORKFLOW_PARAMETER_TYPE_MASTER_ROUTE: string = join(
  WORKFLOW_PARAMETER_TYPE_ROUTE,
  "workflow-parameter-type-master"
);

export const WORKFLOW_STATE_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/workflow-state"
  : "/workflow-state";
export const WORKFLOW_STATE_MASTER_ROUTE: string = join(
  WORKFLOW_STATE_ROUTE,
  "workflow-state-master"
);

export const WORKFLOW_STEP_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/workflow-step"
  : "/workflow-step";
export const WORKFLOW_STEP_MASTER_ROUTE: string = join(
  WORKFLOW_STEP_ROUTE,
  "workflow-step-master"
);
export const WORKFLOW_STEP_DETAIL_ROUTE: string = join(
  WORKFLOW_STEP_ROUTE,
  "workflow-step-detail"
);

export const WORKFLOW_TYPE_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/workflow-type"
  : "/workflow-type";
export const WORKFLOW_TYPE_MASTER_ROUTE: string = join(
  WORKFLOW_TYPE_ROUTE,
  "workflow-type-master"
);

export const LDAP_CONFIGURATION_ROUTE: string = ROOT_ROUTE
  ? ROOT_ROUTE + "/ldap-configuration"
  : "/ldap-configuration";

  export const INIT_ROUTE: string = ROOT_ROUTE ? ROOT_ROUTE + "/init" : "/init";
  export const INIT_MASTER_ROUTE: string = join(INIT_ROUTE, "init-master");
