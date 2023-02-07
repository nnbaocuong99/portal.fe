/* begin general import */
import { Close16, Send16 } from "@carbon/icons-react";
import { Col, Modal, Row, Switch } from "antd";
import PageHeader from "components/PageHeader/PageHeader";
import { WORKFLOW_DEFINITION_ROUTE } from "config/route-consts";
import { OrganizationFilter } from "models/Organization";
import { SiteFilter } from "models/Site";
import {
  WorkflowDefinition,
  WorkflowDefinitionFilter,
} from "models/WorkflowDefinition";
import { WorkflowTypeFilter } from "models/WorkflowType";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react3l-ui-library";
import DatePicker from "react3l-ui-library/build/components/Calendar/DatePicker/DatePicker";
import FormItem from "react3l-ui-library/build/components/FormItem";
import InputText from "react3l-ui-library/build/components/Input/InputText";
import Select from "react3l-ui-library/build/components/Select/SingleSelect/Select";
import TreeSelect from "react3l-ui-library/build/components/TreeSelect/TreeSelect";
import { workflowDefinitionRepository } from "repositories/workflow-definition-repository";
import { detailService } from "services/detail-service";
import { fieldService } from "services/field-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
import "./WorkflowDefinitionDetail.scss";

/* end individual import */

function WorkflowDefinitionDetail() {
  const [translate] = useTranslation();

  const { model, dispatch } =
    detailService.useModel<WorkflowDefinition>(WorkflowDefinition);

  const { isDetail } = detailService.useGetIsDetail<WorkflowDefinition>(
    workflowDefinitionRepository.get,
    dispatch
  );

  const {
    handleChangeDateField,
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeTreeField,
    handleChangeSelectField,
  } = fieldService.useField(model, dispatch);

  const { handleGoMaster, handleSaveModel } =
    detailService.useActionsDetail<WorkflowDefinition>(
      model,
      workflowDefinitionRepository.save,
      handleChangeAllField,
      WORKFLOW_DEFINITION_ROUTE
    );

  const onClickSave = React.useCallback(() => {
    // Nếu trạng thái của model là Hoạt động thì cần xét điều kiện để đưa ra alert
    if (model?.statusId === 1) {
      workflowDefinitionRepository
        .list(new WorkflowDefinitionFilter())
        .subscribe((res: WorkflowDefinition[]) => {
          if (res && res?.length > 0) {
            let count = 0;
            // eslint-disable-next-line array-callback-return
            res.map((workflowDefinition) => {
              if (
                workflowDefinition?.organizationId === model?.organizationId &&
                workflowDefinition?.workflowTypeId === model?.workflowTypeId &&
                workflowDefinition?.id !== model?.id
              ) {
                count++;
              }
            });
            if (count > 0) {
              Modal.confirm({
                title: translate("workflowDefinitions.notifications.save"),
                okType: "danger",
                onOk() {
                  handleSaveModel();
                },
              });
            } else handleSaveModel();
          }
        });
    } else handleSaveModel();
  }, [
    handleSaveModel,
    model?.id,
    model?.organizationId,
    model?.statusId,
    model?.workflowTypeId,
    translate,
  ]);
  const ref = React.useRef<boolean>(true);
  React.useEffect(() => {
    if (ref.current && !model?.id) {
      handleChangeAllField({ ...model, statusId: 1 });
      ref.current = false;
    }
  }, [model, handleChangeAllField]);

  const handleChangeStatus = React.useCallback(
    (checked) => {
      const newModel = { ...model };
      if (checked) {
        newModel.statusId = 1;
      } else {
        newModel.statusId = 0;
      }
      handleChangeAllField(newModel);
    },
    [handleChangeAllField, model]
  );
  const handleChangeSite = React.useCallback(
    () => (idValue: number, value: any) => {
      const newModel = { ...model };
      newModel.siteId = idValue;
      newModel.site = value;
      newModel.workflowType = undefined;
      newModel.workflowTypeId = undefined;
      handleChangeAllField(newModel);
    },
    [handleChangeAllField, model]
  );
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
        <div className="page page-detail workflow-definition-page-detail p-t--lg p-l--xxl p-r--xxl p-b--lg">
          <div className="page-detail__title p-b--lg">
            {!isDetail
              ? translate("general.actions.create")
              : translate("general.detail.title")}
          </div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.code)
                )}
                message={model.errors?.code}
              >
                <InputText
                  label={translate("workflowDefinitions.code")}
                  type={0}
                  value={model.code}
                  placeHolder={translate(
                    "workflowDefinitions.placeholder.code"
                  )}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.code),
                  })}
                  isRequired
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.name)
                )}
                message={model.errors?.name}
              >
                <InputText
                  isRequired
                  label={translate("workflowDefinitions.name")}
                  type={0}
                  value={model.name}
                  placeHolder={translate(
                    "workflowDefinitions.placeholder.name"
                  )}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.name),
                  })}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.startDate)
                )}
                message={model.errors?.startDate}
              >
                <DatePicker
                  isRequired
                  label={translate("workflowDefinitions.startDate")}
                  value={model.startDate}
                  type={0}
                  onChange={handleChangeDateField({
                    fieldName: nameof(model.startDate),
                  })}
                  placeHolder={translate(
                    "workflowDefinitions.placeholder.startDate"
                  )}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.endDate)
                )}
                message={model.errors?.endDate}
              >
                <DatePicker
                  label={translate("workflowDefinitions.endDate")}
                  value={model.endDate}
                  type={0}
                  onChange={handleChangeDateField({
                    fieldName: nameof(model.endDate),
                  })}
                  placeHolder={translate(
                    "workflowDefinitions.placeholder.endDate"
                  )}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.organization)
                )}
                message={model.errors?.organization}
              >
                <TreeSelect
                  isRequired
                  label={translate("workflowDefinitions.organization")}
                  type={0}
                  placeHolder={translate(
                    "workflowDefinitions.placeholder.organization"
                  )}
                  selectable={true}
                  classFilter={OrganizationFilter}
                  onChange={handleChangeTreeField({
                    fieldName: nameof(model.organization),
                  })}
                  checkStrictly={true}
                  getTreeData={
                    workflowDefinitionRepository.singleListOrganization
                  }
                  item={model.organization}
                />
              </FormItem>
            </Col>
            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.site)
                )}
                message={model.errors?.site}
              >
                <Select
                  isRequired
                  label={translate("workflowDefinitions.site")}
                  type={0}
                  classFilter={SiteFilter}
                  searchProperty={"name"}
                  placeHolder={translate(
                    "workflowDefinitions.placeholder.site"
                  )}
                  getList={workflowDefinitionRepository.singleListSite}
                  onChange={handleChangeSite()}
                  value={model.site}
                />
              </FormItem>
            </Col>
            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.workflowType)
                )}
                message={model.errors?.workflowType}
              >
                <Select
                  isRequired
                  label={translate("workflowDefinitions.workflowType")}
                  type={0}
                  classFilter={WorkflowTypeFilter}
                  searchProperty={"name"}
                  placeHolder={translate(
                    "workflowDefinitions.placeholder.workflowType"
                  )}
                  getList={workflowDefinitionRepository.singleListWorkflowType}
                  onChange={handleChangeSelectField({
                    fieldName: nameof(model.workflowType),
                  })}
                  valueFilter={{
                    ...new WorkflowTypeFilter(),
                    siteId: { equal: model?.siteId },
                  }}
                  value={model.workflowType}
                  disabled={!model?.siteId}
                />
              </FormItem>
            </Col>
            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.status)
                )}
                message={model.errors?.status}
              >
                <div>
                  <div className="label-status">
                    {translate("workflowDefinitions.status")}
                  </div>
                  <Switch
                    checked={model.statusId === 1 ? true : false}
                    onChange={handleChangeStatus}
                    className="switch_status"
                  />
                </div>
              </FormItem>
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
              <Button
                type="primary"
                className="btn--lg"
                icon={<Send16 />}
                onClick={onClickSave}
              >
                {translate("general.actions.save")}
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default WorkflowDefinitionDetail;
