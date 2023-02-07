/* begin general import */
import { Add16, Close16, OverflowMenuHorizontal16 } from "@carbon/icons-react";
import { Col, Dropdown, Menu, Row, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import {
  WORKFLOW_DEFINITION_ROUTE,
  WORKFLOW_DIRECTION_DETAIL_ROUTE,
  WORKFLOW_DIRECTION_PREVIEW_ROUTE,
} from "config/route-consts";
import { formatDateTime } from "helpers/date-time";
import { renderMasterIndex } from "helpers/table";
// import { ASSETS_IMAGE } from "config/consts";
import { Status } from "models/Status";
/* end general import */
/* begin individual import */
import { WorkflowDefinition } from "models/WorkflowDefinition";
import { WorkflowDirection } from "models/WorkflowDirection";
import { WorkflowStep } from "models/WorkflowStep";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import {
  Button,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  StandardTable,
} from "react3l-ui-library";
import { workflowDefinitionRepository } from "repositories/workflow-definition-repository";
import { detailService } from "services/detail-service";
import { fieldService } from "services/field-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
/* end individual import */

function WorkflowDefinitionPreview() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { model, dispatch } =
    detailService.useModel<WorkflowDefinition>(WorkflowDefinition);
  const { isDetail } = detailService.useGetIsDetail<WorkflowDefinition>(
    workflowDefinitionRepository.get,
    dispatch
  );

  const { handleChangeAllField } = fieldService.useField(model, dispatch);
  const { handleGoMaster } = detailService.useActionsDetail<WorkflowDefinition>(
    model,
    workflowDefinitionRepository.save,
    handleChangeAllField,
    WORKFLOW_DEFINITION_ROUTE
  );
  const handleGoCreateWorkflowDirection = React.useCallback(
    (id) => {
      history.push(
        `${WORKFLOW_DIRECTION_DETAIL_ROUTE}?workflowDefinitionId=${id}`
      );
    },
    [history]
  );

  const handleGoPreviewDirection = React.useCallback(
    (id: number) => {
      return () => {
        history.push(`${WORKFLOW_DIRECTION_PREVIEW_ROUTE}?id=${id}`);
      };
    },
    [history]
  );

  const menuAction = React.useCallback(
    (id: number, workflowDirections: WorkflowDefinition) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu"
            onClick={handleGoPreviewDirection(workflowDirections?.id)}
          >
            {translate("general.actions.view")}
          </div>
        </Menu.Item>
      </Menu>
    ),
    [translate, handleGoPreviewDirection]
  );
  const columns: ColumnProps<WorkflowDirection>[] = React.useMemo(() => {
    return [
      {
        title: (
          <div className="text-center gradient-text">
            {translate("general.columns.index")}
          </div>
        ),
        key: "index",
        width: 80,
        align: "center",
        render: renderMasterIndex<WorkflowDirection>(),
      },
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDefinitions.workflowDirections.fromStep")}
          />
        ),
        key: nameof(model.workflowDirections[0].fromStep),
        dataIndex: nameof(model.workflowDirections[0].fromStep),
        width: 120,
        ellipsis: true,
        render(fromStep: WorkflowDirection) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={fromStep?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDefinitions.workflowDirections.role")}
          />
        ),
        key: "RoleFromStep",
        dataIndex: nameof(model.workflowDirections[0].fromStep),
        width: 120,
        ellipsis: true,
        render(fromStep: WorkflowStep) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={fromStep?.role?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDefinitions.workflowDirections.toStep")}
          />
        ),
        key: nameof(model.workflowDirections[0].toStep),
        dataIndex: nameof(model.workflowDirections[0].toStep),
        width: 120,
        ellipsis: true,
        render(toStep: WorkflowDirection) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={toStep?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDefinitions.workflowDirections.role")}
          />
        ),
        key: "RoleToStep",
        dataIndex: nameof(model.workflowDirections[0].toStep),
        width: 120,
        ellipsis: true,
        render(toStep: WorkflowStep) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={toStep?.role?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDefinitions.status")}
          />
        ),
        key: nameof(model.workflowDirections[0].status),
        dataIndex: nameof(model.workflowDirections[0].status),
        width: 120,

        ellipsis: true,
        render(status: Status) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                value={status.name}
                className={status.id === 1 ? "tag--active" : "tag--inactive"}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="right"
            title={translate("general.actions.label")}
          />
        ),
        key: "action",
        dataIndex: nameof(model[0].id),
        fixed: "right",
        width: 80,
        align: "center",
        render(id: number, workflowDefinition: WorkflowDefinition) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, workflowDefinition)}
                trigger={["click"]}
                placement="bottom"
                arrow
              >
                <OverflowMenuHorizontal16 />
              </Dropdown>
            </div>
          );
        },
      },
    ];
  }, [menuAction, model, translate]);

  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("workflowDefinitions.master.subHeader")}
          breadcrumbItems={[
            translate("workflowDefinitions.master.header"),
            translate("workflowDefinitions.master.subHeader"),
          ]}
        />
        <div className="page page-detail p-t--lg p-l--xxl p-r--xxl p-b--lg">
          <div className="page-detail__title p-b--lg">
            {!isDetail
              ? translate("general.actions.create")
              : translate("general.detail.title")}
          </div>
          <Row gutter={{ xs: 8, sm: 12, md: 24, lg: 32 }}>
            <Col lg={24} className="gutter-row">
              <Row>
                <Col span={6}>
                  <div className="">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDefinitions.code")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <Tooltip title={model.code}>
                        {utilService.limitWord(model.code, 30)}
                      </Tooltip>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDefinitions.name")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <Tooltip title={model.name}>
                        {utilService.limitWord(model.name, 30)}
                      </Tooltip>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="">
                    <div className="page-detail__title general-field__first-row">
                      <span>
                        {translate("workflowDefinitions.organization")}
                      </span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <Tooltip title={model.organization?.name}>
                        {utilService.limitWord(model.organization?.name, 30)}
                      </Tooltip>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="">
                    <div className="page-detail__title general-field__first-row">
                      <span>
                        {translate("workflowDefinitions.workflowType")}
                      </span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <Tooltip title={model.workflowType?.name}>
                        {utilService.limitWord(model.workflowType?.name, 30)}
                      </Tooltip>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="p-t--xxs">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDefinitions.startDate")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <span>
                        {model.startDate
                          ? moment(model.startDate).format("DD/MM/YYYY")
                          : null}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="p-t--xxs">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDefinitions.endDate")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <span>
                        {model.endDate
                          ? moment(model.endDate).format("DD/MM/YYYY")
                          : null}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="p-t--xxs">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDefinitions.status")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <span>{model.status?.name}</span>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="p-t--xxs">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDefinitions.site")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <span>{model.site?.name}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="page-detail__title p-b--lg p-t--lg">
            {translate("workflowDefinitions.preview.executionThreads")}
          </div>
          <Row gutter={{ xs: 8, sm: 12, md: 24, lg: 32 }}>
            <Col lg={24} className="gutter-row">
              <Button
                type="primary"
                className="btn--lg"
                icon={<Add16 />}
                onClick={() => handleGoCreateWorkflowDirection(model.id)}
              >
                {translate("workflowDefinitions.create")}
              </Button>

              <StandardTable
                rowKey={nameof(model.workflowDirections[0].id)}
                dataSource={model.workflowDirections}
                columns={columns}
                tableSize={"md"}
                scroll={{ y: 500, x: 1000 }}
                pagination={false}
              />
            </Col>
          </Row>
          <div className="page-detail__title m-b--lg p-t--lg">
            {translate("workflowDefinitions.preview.editInformation")}
          </div>
          <Row gutter={{ xs: 8, sm: 12, md: 24, lg: 32 }}>
            <Col lg={24} className="gutter-row">
              <Row>
                <Col span={6}>
                  <div className="">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDefinitions.createdAt")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <span>{formatDateTime(model?.createdAt)}</span>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDefinitions.creator")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <Tooltip title={model?.creator?.displayName}>
                        {utilService.limitWord(model?.creator?.displayName, 30)}
                      </Tooltip>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDefinitions.updatedAt")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <span>{formatDateTime(model?.updatedAt)}</span>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDefinitions.modifier")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <Tooltip title={model?.modifier?.displayName}>
                        {utilService.limitWord(
                          model?.modifier?.displayName,
                          30
                        )}
                      </Tooltip>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <footer className="app-footer">
          <div className="app-footer__full d-flex justify-content-end align-items-center">
            <div className="app-footer__actions d-flex justify-content-end">
              <Button
                type="secondary"
                className="btn--lg"
                icon={<Close16 />}
                onClick={handleGoMaster}
              >
                {translate("general.actions.close")}
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default WorkflowDefinitionPreview;
