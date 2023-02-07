import { WORKFLOW_STEP_DETAIL_ROUTE, WORKFLOW_STEP_MASTER_ROUTE } from "config/route-consts";
import { ProtectedRoute } from "pages/Authentication/ProtectedRoute";
import React from "react";
import { Switch } from "react-router-dom";
import { authorizationService } from "services/authorization-service";
import WorkflowStepMaster from "./WorkflowStepMaster/WorkflowStepMaster";
import WorkflowStepDetail from './WorkflowStepDetail/WorkflowStepDetail';

function WorkflowStepView() {
  const { auth } = authorizationService.useAuthorizedRoute();
  return (
    <Switch>
      <ProtectedRoute
        path={WORKFLOW_STEP_MASTER_ROUTE}
        key={WORKFLOW_STEP_MASTER_ROUTE}
        component={WorkflowStepMaster}
        auth={auth(WORKFLOW_STEP_MASTER_ROUTE)}
      />
       <ProtectedRoute
        path={WORKFLOW_STEP_DETAIL_ROUTE}
        key={WORKFLOW_STEP_DETAIL_ROUTE}
        component={WorkflowStepDetail}
        auth={auth(WORKFLOW_STEP_DETAIL_ROUTE)}
      />
    </Switch>
  );
}

export { WorkflowStepMaster };
export default WorkflowStepView;
