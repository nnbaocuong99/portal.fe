import Login from "pages/Authentication/Login/Login";
import Logout from "pages/Authentication/Logout";
import Color from "pages/Color";
import SideBarPage from "pages/SideBar";
import Typography from "pages/Typography";
import { Redirect } from "react-router";
import AppUserView from "views/AppUserView/AppUserView";
import SiteView from "views/SiteView/SiteView";
import RoleView from "views/RoleView/RoleView";
import OrganizationTreeView from "views/OrganizationTreeView/OrganizationTreeView";
import {
  APP_USER_MASTER_ROUTE,
  APP_USER_ROUTE,
  COLOR_PAGE_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  ROLE_ROUTE,
  ORGANIZATION_ROUTE,
  SIDE_BAR_PAGE_ROUTE,
  SITE_ROUTE,
  TYPOGRAPHY_PAGE_ROUTE,
  PROVINCE_ROUTE,
  DISTRICT_ROUTE,
  WARD_ROUTE,
  NATION_ROUTE,
  USER_NOTIFICATION_ROUTE,
  WORKFLOW_DEFINITION_ROUTE,
  WORKFLOW_DIRECTION_ROUTE,
  WORKFLOW_STEP_ROUTE,
  WORKFLOW_PARAMETER_ROUTE,
  LDAP_CONFIGURATION_ROUTE,
  INIT_ROUTE,
} from "./route-consts";
import ProvinceView from "views/ProvinceView/ProvinceView";
import DistrictView from "views/DistrictView/DistrictView";
import WardView from "views/WardView/WardView";
import NationView from "views/NationView/NationView";
import NotificationView from "views/NotificationView/NotificationView";
import WorkflowDefinitionView from "views/WorkflowDefinitionView/WorkflowDefinitionView";
import WorkflowDirectionView from "views/WorkflowDirectionView/WorkflowDirectionView";
import WorkflowStepView from "views/WorkflowStepView/WorkflowStepView";
import WorkflowParameterView from "views/WorkflowParameterView/WorkflowParameterView";
import ForbidentView from "pages/ForbidentView/ForbidentView";
import LDAPConfigurationView from "views/LDAPConfiguration/LDAPConfigurationView";
import InitView from "views/InitView/InitView";

export interface Route {
  path: string;
  component: () => JSX.Element;
  exact?: boolean;
}

const userRoutes: Route[] = [
  // Default init route for template:

  {
    path: TYPOGRAPHY_PAGE_ROUTE,
    component: Typography,
  },
  {
    path: COLOR_PAGE_ROUTE,
    component: Color,
  },
  {
    path: SIDE_BAR_PAGE_ROUTE,
    component: SideBarPage,
  },
  {
    path: APP_USER_ROUTE,
    component: AppUserView,
  },
  {
    path: ROLE_ROUTE,
    component: RoleView,
  },
  { path: ORGANIZATION_ROUTE, component: OrganizationTreeView },

  // Created route for project:

  {
    path: WORKFLOW_DEFINITION_ROUTE,
    component: WorkflowDefinitionView,
  },
  {
    path: WORKFLOW_DIRECTION_ROUTE,
    component: WorkflowDirectionView,
  },

  {
    path: WORKFLOW_STEP_ROUTE,
    component: WorkflowStepView,
  },
  {
    path: WORKFLOW_PARAMETER_ROUTE,
    component: WorkflowParameterView,
  },

  {
    path: SITE_ROUTE,
    component: SiteView,
  },

  {
    path: INIT_ROUTE,
    component: InitView,
  },

  {
    path: NATION_ROUTE,
    component: NationView,
  },

  {
    path: PROVINCE_ROUTE,
    component: ProvinceView,
  },

  {
    path: DISTRICT_ROUTE,
    component: DistrictView,
  },

  {
    path: WARD_ROUTE,
    component: WardView,
  },
  {
    path: USER_NOTIFICATION_ROUTE,
    component: NotificationView,
  },
  {
    path: LDAP_CONFIGURATION_ROUTE,
    component: LDAPConfigurationView,
  },
  // this base route should be at the end of all other routes
  {
    path: `${process.env.PUBLIC_URL}/`,
    exact: true,
    component: () => <Redirect to={APP_USER_MASTER_ROUTE} />,
  },
];

const authRoutes = [
  { path: LOGOUT_ROUTE, component: Logout },
  { path: LOGIN_ROUTE, component: Login },
  {
    path: "/403",
    // exact: true,
    component: ForbidentView,
  },
];

export { userRoutes, authRoutes };
