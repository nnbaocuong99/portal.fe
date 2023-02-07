import {
  WORKFLOW_DIRECTION_DETAIL_ROUTE,
  WORKFLOW_DIRECTION_MASTER_ROUTE,
  WORKFLOW_DIRECTION_PREVIEW_ROUTE,
} from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import WorkflowDirectionDetail from "./WorkflowDirectionDetail/WorkflowDirectionDetail";
import WorkflowDirectionMaster from "./WorkflowDirectionMaster/WorkflowDirectionMaster";
import WorkflowDirectionPreview from "./WorkflowDirectionMaster/WorkflowDirectionPreview";

function WorkflowDirectionView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={WORKFLOW_DIRECTION_MASTER_ROUTE}
        key={WORKFLOW_DIRECTION_MASTER_ROUTE}
        component={WorkflowDirectionMaster}
        auth={auth(WORKFLOW_DIRECTION_MASTER_ROUTE)}
      />
      <ProtectedRoute
        path={WORKFLOW_DIRECTION_DETAIL_ROUTE}
        key={WORKFLOW_DIRECTION_DETAIL_ROUTE}
        component={WorkflowDirectionDetail}
        auth={auth(WORKFLOW_DIRECTION_DETAIL_ROUTE)}
      />
      DIRECTION
      <ProtectedRoute
        path={WORKFLOW_DIRECTION_PREVIEW_ROUTE}
        key={WORKFLOW_DIRECTION_PREVIEW_ROUTE}
        component={WorkflowDirectionPreview}
        auth={auth(WORKFLOW_DIRECTION_PREVIEW_ROUTE)}
      />
    </Switch>
  );
}

export { WorkflowDirectionMaster };
export default WorkflowDirectionView;
