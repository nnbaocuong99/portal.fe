import { WORKFLOW_DIRECTION_CONDITION_MASTER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import WorkflowDirectionConditionMaster from "./WorkflowDirectionConditionMaster/WorkflowDirectionConditionMaster";

function WorkflowDirectionConditionView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={WORKFLOW_DIRECTION_CONDITION_MASTER_ROUTE}
        key={WORKFLOW_DIRECTION_CONDITION_MASTER_ROUTE}
        component={WorkflowDirectionConditionMaster}
        auth={auth(WORKFLOW_DIRECTION_CONDITION_MASTER_ROUTE)}
      />
    </Switch>
  );
}

export { WorkflowDirectionConditionMaster };
export default WorkflowDirectionConditionView;
