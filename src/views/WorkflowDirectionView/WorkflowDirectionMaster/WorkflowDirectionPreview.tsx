/* begin general import */
import { Close16 } from "@carbon/icons-react";
import { Col, Row, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { WORKFLOW_DIRECTION_ROUTE } from "config/route-consts";

import { formatDate } from "helpers/date-time";
import { formatNumber } from "helpers/number";
import { renderMasterIndex } from "helpers/table";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Organization, OrganizationFilter } from "models/Organization";
/* end general import */
/* begin individual import */
import { WorkflowDirection } from "models/WorkflowDirection";
import { WorkflowOperator } from "models/WorkflowOperator";
import { WorkflowParameter } from "models/WorkflowParameter";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  StandardTable,
} from "react3l-ui-library";
import { workflowDirectionRepository } from "repositories/workflow-direction-repository";
import { detailService } from "services/detail-service";
import { fieldService } from "services/field-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
/* end individual import */

function WorkflowDirectionPreview() {
  const [translate] = useTranslation();

  const { model, dispatch } =
    detailService.useModel<WorkflowDirection>(WorkflowDirection);
  const { isDetail } = detailService.useGetIsDetail<WorkflowDirection>(
    workflowDirectionRepository.get,
    dispatch
  );

  const { handleChangeAllField } = fieldService.useField(model, dispatch);
  const { handleGoMaster } = detailService.useActionsDetail<WorkflowDirection>(
    model,
    workflowDirectionRepository.save,
    handleChangeAllField,
    WORKFLOW_DIRECTION_ROUTE
  );

  const [organizationList, setOrganizationList] = React.useState<Organization>(
    []
  );
  const [appUserList, setAppUserList] = React.useState<AppUser>([]);
  React.useEffect(() => {
    workflowDirectionRepository
      .singleListOrganization(new OrganizationFilter())
      .subscribe((res) => {
        setOrganizationList(res);
      });
    workflowDirectionRepository
      .singleListAppUser(new AppUserFilter())
      .subscribe((res) => {
        setAppUserList(res);
      });
  }, []);

  const renderValue = React.useMemo(() => {
    return (content: any, value: any) => {
      switch (content?.workflowParameter?.workflowParameterTypeId) {
        /* singleList */
        case 1:
          // eslint-disable-next-line no-case-declarations
          let valueObject;
          if (content.workflowParameter.code === "OrganizationId") {
            valueObject = organizationList.filter(
              (item: any) => item.id === Number(value)
            );
          }
          if (content.workflowParameter.code === "SaleEmployeeId") {
            valueObject = appUserList.filter(
              (item: any) => item.id === Number(value)
            );
          }

          return (
            <>
              {valueObject && valueObject?.length > 0 && valueObject[0]?.id && (
                <div>
                  {valueObject[0].name
                    ? valueObject[0].name
                    : valueObject[0].displayName}
                </div>
              )}
            </>
          );
        /* string */
        case 2:
          return <>{value}</>;
        /* Long or decimal */
        case 3:
          return <>{formatNumber(Number(value))}</>;
        case 4:
          return <>{formatNumber(Number(value))}</>;
        /* date */
        case 5:
          return <>{formatDate(value)}</>;
      }
    };
  }, [appUserList, organizationList]);

  const columns: ColumnProps<WorkflowDirection>[] = React.useMemo(() => {
    return [
      {
        title: (
          <LayoutHeader
            orderType="center"
            title={translate("general.columns.index")}
          />
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
            title={translate(
              "workflowDirections.workflowDirectionConditions.workflowParameter"
            )}
          />
        ),

        key: nameof(model.workflowDirectionConditions[0].workflowParameter),
        dataIndex: nameof(
          model.workflowDirectionConditions[0].workflowParameter
        ),
        width: 100,
        render(workflowParameter: WorkflowParameter) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={workflowParameter?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate(
              "workflowDirections.workflowDirectionConditions.workflowOperator"
            )}
          />
        ),

        key: nameof(model.workflowDirectionConditions[0].workflowOperator),
        dataIndex: nameof(
          model.workflowDirectionConditions[0].workflowOperator
        ),
        width: 100,
        render(workflowOperator: WorkflowOperator) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={workflowOperator?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate(
          "workflowDirections.workflowDirectionConditions.value"
        ),
        width: 100,
        key: nameof(model.workflowDirectionConditions[0].value),
        dataIndex: nameof(model.workflowDirectionConditions[0].value),
        render(...[value, content]) {
          return renderValue(content, value);
        },
      },
    ];
  }, [model.workflowDirectionConditions, renderValue, translate]);

  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("workflowDirections.master.subHeader")}
          breadcrumbItems={[
            translate("workflowDirections.master.header"),
            translate("workflowDirections.master.subHeader"),
          ]}
        />
        <div className="page page-detail p-t--lg p-l--xxl p-r--xxl p-b--lg">
          <div className="page-detail__title p-b--lg">
            {!isDetail
              ? translate("general.actions.create")
              : translate("general.detail.title")}
          </div>
          <Row>
            <Col lg={24} className="gutter-row">
              <Row>
                <Col span={8} className="p-r--sm">
                  <div className="page-detail__title p-t--xxs">
                    {translate("workflowDirections.titles.mailForCurrentStep")}
                  </div>
                  <div className="p-t--xxs">
                    <div className="general-field__first-row">
                      <span>
                        {translate("workflowDirections.subjectMail")}:
                      </span>
                    </div>
                    <div className="general-field__second-row p-t--xxs break-word">
                      {model.subjectMailForCurrentStep}
                    </div>
                  </div>
                  <div className="p-t--xxs">
                    <div className="general-field__first-row">
                      <span>{translate("workflowDirections.bodyMail")}:</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs break-word">
                      {model.bodyMailForCurrentStep}
                    </div>
                  </div>
                </Col>
                <Col span={8} className="p-r--sm">
                  <div className="page-detail__title p-t--xxs">
                    {translate("workflowDirections.titles.mailForCreator")}
                  </div>
                  <div className="p-t--xxs">
                    <div className="general-field__first-row">
                      <span>
                        {translate("workflowDirections.subjectMail")}:
                      </span>
                    </div>
                    <div className="general-field__second-row p-t--xxs break-word">
                      {model.subjectMailForCreator}
                    </div>
                  </div>
                  <div className="p-t--xxs">
                    <div className="general-field__first-row">
                      <span>{translate("workflowDirections.bodyMail")}:</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs break-word">
                      {model.bodyMailForCreator}
                    </div>
                  </div>
                </Col>
                <Col span={8} className="p-r--sm">
                  <div className="page-detail__title p-t--xxs">
                    {translate("workflowDirections.titles.mailForNextStep")}
                  </div>
                  <div className="p-t--xxs">
                    <div className="general-field__first-row">
                      <span>
                        {translate("workflowDirections.subjectMail")}:
                      </span>
                    </div>
                    <div className="general-field__second-row p-t--xxs break-word">
                      {model.subjectMailForNextStep}
                    </div>
                  </div>
                  <div className="p-t--xxs">
                    <div className="general-field__first-row">
                      <span>{translate("workflowDirections.bodyMail")}:</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs break-word">
                      {model.bodyMailForNextStep}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={8} className="p-r--sm">
                  <div className="p-t--xxs">
                    <div className="page-detail__title general-field__first-row">
                      <span>
                        {translate("workflowDirections.workflowDefinition")}
                      </span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <Tooltip title={model?.workflowDefinition?.name}>
                        {utilService.limitWord(
                          model?.workflowDefinition?.name,
                          30
                        )}
                      </Tooltip>
                    </div>
                  </div>
                </Col>
                <Col span={8} className="p-r--sm">
                  <div className="p-t--xxs">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDirections.status")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <span>{model?.status?.name}</span>
                    </div>
                  </div>
                </Col>
                <Col span={8} className="p-r--sm">
                  <div className="p-t--xxs">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDirections.fromStep")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <Tooltip title={model?.fromStep?.name}>
                        {utilService.limitWord(model?.fromStep?.name, 30)}
                      </Tooltip>
                    </div>
                  </div>
                </Col>
                <Col span={8} className="p-r--sm">
                  <div className="p-t--xxs">
                    <div className="page-detail__title general-field__first-row">
                      <span>{translate("workflowDirections.toStep")}</span>
                    </div>
                    <div className="general-field__second-row p-t--xxs">
                      <Tooltip title={model?.toStep?.name}>
                        {utilService.limitWord(model?.toStep?.name, 30)}
                      </Tooltip>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="page-detail__title p-t--lg p-b--lg">
            {translate("workflowDirections.titles.workflowDirectionCondition")}
          </div>
          <div className="m-b--lg">
            <StandardTable
              columns={columns}
              dataSource={model.workflowDirectionConditions}
              rowKey={nameof(model.workflowDirectionConditions[0].id)}
              pagination={false}
              tableSize="md"
              isDragable={true}
              scroll={{ x: 1000, y: 500 }}
            />
          </div>
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

export default WorkflowDirectionPreview;
