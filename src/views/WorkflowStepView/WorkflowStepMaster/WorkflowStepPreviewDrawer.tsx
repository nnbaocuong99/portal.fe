/* begin general import */
import { Col, Row, Tooltip } from "antd";
import { ASSETS_SVG } from "config/consts";
import { WorkflowStep } from "models/WorkflowStep";
import React from "react";
import { useTranslation } from "react-i18next";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import { utilService } from "services/util-service";
import "./WorkflowStepPreviewDrawer.scss";
/* end individual import */

interface WorkflowStepPreviewDrawerProps extends DrawerProps {
  model: WorkflowStep;
  loading?: boolean;
}

function WorkflowStepPreviewDrawer(props: WorkflowStepPreviewDrawerProps) {
  const [translate] = useTranslation();

  const { model, loading, visible, handleCancel } = props;
  return (
    <Drawer
      {...props}
      visible={visible}
      handleCancel={handleCancel}
      handleClose={handleCancel}
      visibleFooter={false}
      title={
        model?.id
          ? translate("general.detail.title")
          : translate("general.actions.create")
      }
    >
      {loading ? (
        <div className="loading-block">
          <img src={ASSETS_SVG + "/spinner.svg"} alt="Loading..." />
        </div>
      ) : (
        <div className="page page__detail">
          <div className="w-100 page__detail-tabs">
            <Row>
              <Col lg={24}>
                <div className="d-flex p-b--xxs">
                  <div className="left-title">
                    {translate("workflowSteps.code")}:
                  </div>
                  <div className="right-title p-l--xxs">
                    <Tooltip title={model?.code}>
                      {utilService.limitWord(model?.code, 30)}
                    </Tooltip>
                  </div>
                </div>
              </Col>
              <Col lg={24}>
                <div className="d-flex p-b--xxs">
                  <div className="left-title">
                    {translate("workflowSteps.name")}:
                  </div>
                  <div className="right-title p-l--xxs">
                    <Tooltip title={model?.name}>
                      {utilService.limitWord(model?.name, 30)}
                    </Tooltip>
                  </div>
                </div>
              </Col>
              <Col lg={24}>
                <div className="d-flex p-b--xxs">
                  <div className="left-title">
                    {translate("workflowSteps.subjectMailForReject")}:
                  </div>
                  <div className="right-title p-l--xxs break-word">
                    <span>{model?.subjectMailForReject}</span>
                  </div>
                </div>
              </Col>
              <Col lg={24}>
                <div className="d-flex p-b--xxs">
                  <div className="left-title">
                    {translate("workflowSteps.bodyMailForReject")}:
                  </div>
                  <div className="right-title p-l--xxs break-word">
                    <span>{model?.bodyMailForReject}</span>
                  </div>
                </div>
              </Col>
              <Col lg={24}>
                <div className="d-flex p-b--xxs">
                  <div className="left-title">
                    {translate("workflowSteps.status")}:
                  </div>
                  <div className="right-title p-l--xxs">
                    <span>{model?.status?.name}</span>
                  </div>
                </div>
              </Col>
              <Col lg={24}>
                <div className="d-flex p-b--xxs">
                  <div className="left-title">
                    {translate("workflowSteps.workflowDefinition")}:
                  </div>
                  <div className="right-title p-l--xxs">
                    <Tooltip title={model?.workflowDefinition?.name}>
                      {utilService.limitWord(
                        model?.workflowDefinition?.name,
                        30
                      )}
                    </Tooltip>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default WorkflowStepPreviewDrawer;
