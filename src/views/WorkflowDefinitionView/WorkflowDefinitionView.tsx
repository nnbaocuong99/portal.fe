import {
  WORKFLOW_DEFINITION_DETAIL_ROUTE,
  WORKFLOW_DEFINITION_MASTER_ROUTE,
  WORKFLOW_DEFINITION_PREVIEW_ROUTE,
} from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import WorkflowDefinitionDetail from "./WorkflowDefinitionDetail/WorkflowDefinitionDetail";
import WorkflowDefinitionMaster from "./WorkflowDefinitionMaster/WorkflowDefinitionMaster";
import WorkflowDefinitionPreview from "./WorkflowDefinitionMaster/WorkflowDefinitionPreview";

function WorkflowDefinitionView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={WORKFLOW_DEFINITION_MASTER_ROUTE}
        key={WORKFLOW_DEFINITION_MASTER_ROUTE}
        component={WorkflowDefinitionMaster}
        auth={auth(WORKFLOW_DEFINITION_MASTER_ROUTE)}
      />
      <ProtectedRoute
        path={WORKFLOW_DEFINITION_PREVIEW_ROUTE}
        key={WORKFLOW_DEFINITION_PREVIEW_ROUTE}
        component={WorkflowDefinitionPreview}
        auth={auth(WORKFLOW_DEFINITION_PREVIEW_ROUTE)}
      />
      <ProtectedRoute
        path={WORKFLOW_DEFINITION_DETAIL_ROUTE}
        key={WORKFLOW_DEFINITION_DETAIL_ROUTE}
        component={WorkflowDefinitionDetail}
        auth={auth(WORKFLOW_DEFINITION_DETAIL_ROUTE)}
      />
    </Switch>
  );
}

export { WorkflowDefinitionMaster, WorkflowDefinitionDetail };
export default WorkflowDefinitionView;
