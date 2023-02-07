import { Add16, Close16, Send16 } from "@carbon/icons-react";
import { Col, Row, Switch, Tabs } from "antd";
import classNames from "classnames";
import FroalaEditor from "components/FroalaEditor/FroalaEditor";
import PageHeader from "components/PageHeader/PageHeader";
import { WORKFLOW_DIRECTION_MASTER_ROUTE } from "config/route-consts";
import { WorkflowDefinitionFilter } from "models/WorkflowDefinition";
import { WorkflowDirection } from "models/WorkflowDirection";
import { WorkflowStepFilter } from "models/WorkflowStep";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button, FormItem, InputText, Select } from "react3l-ui-library";
import { workflowDirectionRepository } from "repositories/workflow-direction-repository";
import { detailService } from "services/detail-service";
import { fieldService } from "services/field-service";
import { queryStringService } from "services/query-string-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
import WorkflowDirectionContentTable from "./WorkflowDirectionContentTable";
import workflowDirectionDetailStyle from "./WorkflowDirectionDetail.module.scss";
import { useWorkflowDirectionConditionTable } from "./WorkflowDirectionDetailHook/WorkflowDirectionConditionHook";

const { TabPane } = Tabs;

function WorkflowDirectionDetail() {
  const [translate] = useTranslation();
  const [workflowStepFilter, setWorkflowStepFilter] =
    React.useState<WorkflowStepFilter>(new WorkflowStepFilter());

  const params = queryStringService.useGetQueryString("workflowDefinitionId");

  const { model, dispatch } =
    detailService.useModel<WorkflowDirection>(WorkflowDirection);
  const { isDetail } = detailService.useGetIsDetail<WorkflowDirection>(
    workflowDirectionRepository.get,
    dispatch
  );
  const {
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeSelectField,
  } = fieldService.useField(model, dispatch);

  const { handleSaveModel, handleGoMaster } =
    detailService.useActionsDetail<WorkflowDirection>(
      model,
      workflowDirectionRepository.save,
      handleChangeAllField,
      WORKFLOW_DIRECTION_MASTER_ROUTE
    );
  const handleChangeNotificationContent = React.useCallback(
    (fieldName: string) => {
      return (value: any) => {
        const newModel = { ...model };
        newModel[fieldName] = value.currentTarget.value;
        handleChangeAllField(newModel);
      };
    },
    [handleChangeAllField, model]
  );
  React.useEffect(() => {
    if (model.workflowDefinitionId) {
      workflowStepFilter.workflowDefinitionId.equal =
        model.workflowDefinitionId;
      setWorkflowStepFilter({
        ...workflowStepFilter,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);
  const ref = React.useRef<boolean>(true);
  React.useEffect(() => {
    if (ref.current && !model?.id) {
      const tempModel = { ...model };
      if (params?.workflowDefinitionId) {
        const filter = new WorkflowDefinitionFilter();
        filter.id.equal = params?.workflowDefinitionId;
        workflowDirectionRepository
          .singleListWorkflowDefinition(filter)
          .subscribe((res) => {
            tempModel.workflowDefinition = res[0];
            tempModel.workflowDefinitionId = res[0].id;
            tempModel.statusId = 1;
            handleChangeAllField(tempModel);
          });
      } else {
        tempModel.statusId = 1;
        handleChangeAllField(tempModel);
      }

      ref.current = false;
    }
  }, [model, handleChangeAllField, params?.workflowDefinitionId]);

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
  const {
    workflowDirectionConditionList,
    handleAddWorkflowDirectionConditionContent,
    handleWorkflowDirectionConditionTableChange,
    workflowDirectionConditionColumns,
  } = useWorkflowDirectionConditionTable(model, handleChangeAllField);
  const workflowDirectionConditionTable = React.useMemo(
    () => (
      <WorkflowDirectionContentTable
        list={workflowDirectionConditionList}
        handleTableChange={handleWorkflowDirectionConditionTableChange}
        rowSelection={null}
        columns={workflowDirectionConditionColumns}
      />
    ),
    [
      handleWorkflowDirectionConditionTableChange,
      workflowDirectionConditionColumns,
      workflowDirectionConditionList,
    ]
  );

  const handleChangeWorkflowDefinition = React.useCallback(
    (value, object) => {
      const newModel = { ...model };
      newModel.workflowDefinition = object;
      newModel.workflowDefinitionId = value;
      if (workflowStepFilter.workflowDefinitionId.equal !== value) {
        newModel.fromStep = undefined;
        newModel.fromStepId = undefined;
        newModel.toStepId = undefined;
        newModel.toStep = undefined;
      }
      workflowStepFilter.workflowDefinitionId.equal = value;
      setWorkflowStepFilter(workflowStepFilter);
      handleChangeAllField(newModel);
    },
    [handleChangeAllField, model, workflowStepFilter]
  );
  return (
    <>
      <div
        className={classNames(
          "page-content",
          workflowDirectionDetailStyle["workflow-direction-detail"]
        )}
      >
        <PageHeader
          title={translate("workflowDirections.master.subHeader")}
          breadcrumbItems={[
            translate("workflowDirections.master.header"),
            translate("workflowDirections.master.subHeader"),
          ]}
        />
        <div className="page page-detail p-t--lg p-l--xxl p-r--xxl p-b--lg">
          <div className="page-detail__title p-b--xxs">
            {translate("workflowDirections.detail.generalInformation")}
          </div>
          <Row className="p-b--sm">
            <Col lg={6} className="p-r--sm m-t--xxs">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.workflowDefinition)
                )}
                message={model.errors?.workflowDefinition}
              >
                <Select
                  isRequired
                  label={translate("workflowDirections.workflowDefinition")}
                  classFilter={WorkflowDefinitionFilter}
                  placeHolder={translate(
                    "workflowDirections.placeholder.workflowDefinition"
                  )}
                  getList={
                    workflowDirectionRepository.singleListWorkflowDefinition
                  }
                  onChange={handleChangeWorkflowDefinition}
                  value={model.workflowDefinition}
                  disabled={
                    params?.workflowDefinitionId
                      ? true
                      : isDetail
                      ? true
                      : false
                  }
                  type={0}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="p-r--sm m-t--xxs">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  model.errors?.fromStep
                    ? nameof(model.fromStep)
                    : nameof(model.id)
                )}
                message={model.errors?.fromStep || model.errors?.id}
              >
                <Select
                  isRequired
                  label={translate("workflowDirections.fromStep")}
                  isMaterial={true}
                  classFilter={WorkflowStepFilter}
                  placeHolder={translate(
                    "workflowDirections.placeholder.fromStep"
                  )}
                  getList={workflowDirectionRepository.singleListWorkflowStep}
                  onChange={handleChangeSelectField({
                    fieldName: nameof(model.fromStep),
                  })}
                  value={model.fromStep}
                  disabled={
                    !model.workflowDefinitionId ||
                    model.workflowDefinitionId === 0
                      ? true
                      : false
                  }
                  valueFilter={workflowStepFilter}
                  type={0}
                />
              </FormItem>
            </Col>
            <Col lg={6} className="p-r--sm m-t--xxs">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  model.errors?.toStep ? nameof(model.toStep) : nameof(model.id)
                )}
                message={model.errors?.toStep || model.errors?.id}
              >
                <Select
                  isRequired
                  label={translate("workflowDirections.toStep")}
                  isMaterial={true}
                  classFilter={WorkflowStepFilter}
                  placeHolder={translate(
                    "workflowDirections.placeholder.toStep"
                  )}
                  getList={workflowDirectionRepository.singleListWorkflowStep}
                  onChange={handleChangeSelectField({
                    fieldName: nameof(model.toStep),
                  })}
                  value={model.toStep}
                  disabled={
                    !model.workflowDefinitionId ||
                    model.workflowDefinitionId === 0
                      ? true
                      : false
                  }
                  valueFilter={workflowStepFilter}
                  type={0}
                />
              </FormItem>
            </Col>
            <Col lg={6} className="p-r--sm m-t--xxs">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model.errors,
                  nameof(model.status)
                )}
                message={model.errors?.status}
              >
                <div>
                  <div className="label-status">
                    {translate("workflowDirections.status")}
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

          <Tabs defaultActiveKey="1">
            <TabPane
              key="1"
              tab={translate("workflowDirections.tabs.mailConfig")}
            >
              <Row className="m-t--xs">
                <Col span={12} className="p-l--xxxs p-r--sm">
                  <div className="page-detail__title p-b--xxs">
                    {translate("workflowDirections.titles.mailForCurrentStep")}
                  </div>
                  <Row>
                    <Col lg={12}>
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.subjectMailForCurrentStep)
                        )}
                        message={model.errors?.subjectMailForCurrentStep}
                      >
                        <InputText
                          maxLength={225}
                          showCount
                          label={translate("workflowDirections.subjectMail")}
                          value={model.subjectMailForCurrentStep}
                          placeHolder={translate(
                            "workflowDirections.placeholder.subjectMail"
                          )}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.subjectMailForCurrentStep),
                          })}
                          type={0}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={24} className={`m-t--xs `}>
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.bodyMailForCurrentStep)
                        )}
                        message={model.errors?.bodyMailForCurrentStep}
                      >
                        <FroalaEditor
                          value={model.bodyMailForCurrentStep}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.bodyMailForCurrentStep),
                          })}
                          placeholder={translate(
                            "workflowDirections.placeholder.content"
                          )}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <div className="page-detail__title p-b--xxs">
                    {translate("workflowDirections.titles.mailForCreator")}
                  </div>
                  <Row>
                    <Col lg={12} className="">
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.subjectMailForCreator)
                        )}
                        message={model.errors?.subjectMailForCreator}
                      >
                        <InputText
                          maxLength={225}
                          showCount
                          label={translate("workflowDirections.subjectMail")}
                          isMaterial={true}
                          value={model.subjectMailForCreator}
                          placeHolder={translate(
                            "workflowDirections.placeholder.subjectMail"
                          )}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.subjectMailForCreator),
                          })}
                          type={0}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={24} className="m-t--xs">
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model.errors,
                          nameof(model.bodyMailForCreator)
                        )}
                        message={model.errors?.bodyMailForCreator}
                      >
                        <FroalaEditor
                          value={model.bodyMailForCreator}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.bodyMailForCreator),
                          })}
                          placeholder={translate(
                            "workflowDirections.placeholder.bodyMailForCreator"
                          )}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={12} className="p-l--xxxs p-r--sm">
                  <div className="page-detail__title p-b--xxs">
                    {translate("workflowDirections.titles.mailForNextStep")}
                  </div>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.subjectMailForNextStep)
                        )}
                        message={model.errors?.subjectMailForNextStep}
                      >
                        <InputText
                          maxLength={225}
                          showCount
                          label={translate("workflowDirections.subjectMail")}
                          isMaterial={true}
                          value={model.subjectMailForNextStep}
                          placeHolder={translate(
                            "workflowDirections.placeholder.subjectMail"
                          )}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.subjectMailForNextStep),
                          })}
                          type={0}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={24} className="m-t--xs">
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model.errors,
                          nameof(model.bodyMailForNextStep)
                        )}
                        message={model.errors?.bodyMailForNextStep}
                      >
                        <FroalaEditor
                          value={model.bodyMailForNextStep}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.bodyMailForNextStep),
                          })}
                          placeholder={translate(
                            "workflowDirections.placeholder.content"
                          )}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </TabPane>
            <TabPane
              key="2"
              tab={translate("workflowDirections.tabs.notiConfig")}
            >
              <Row className="m-t--xs">
                <Col span={12} className="p-l--xxxs p-r--sm">
                  <div className="page-detail__title p-b--xxs">
                    {translate(
                      "workflowDirections.titles.notificationForCurrentStep"
                    )}
                  </div>
                  <Row>
                    <Col lg={12}>
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.titleNotificationForCurrentStep)
                        )}
                        message={model.errors?.titleNotificationForCurrentStep}
                      >
                        <InputText
                          maxLength={225}
                          showCount
                          label={translate(
                            "workflowDirections.titleNotification"
                          )}
                          value={model.titleNotificationForCurrentStep}
                          placeHolder={translate(
                            "workflowDirections.placeholder.titleNotification"
                          )}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(
                              model.titleNotificationForCurrentStep
                            ),
                          })}
                          type={0}
                        />
                      </FormItem>
                    </Col>

                    <Col lg={24} className="m-t--xs">
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.contentNotificationForCurrentStep)
                        )}
                        message={
                          model.errors?.contentNotificationForCurrentStep
                        }
                      >
                        <textarea
                          id="noti_current_step"
                          name="noti_current_step"
                          onChange={handleChangeNotificationContent(
                            "contentNotificationForCurrentStep"
                          )}
                          value={
                            model.contentNotificationForCurrentStep
                              ? model.contentNotificationForCurrentStep
                              : ""
                          }
                          className="w-100"
                          placeholder={translate(
                            "workflowDirections.placeholder.content"
                          )}
                        ></textarea>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <div className="page-detail__title p-b--xxs">
                    {translate(
                      "workflowDirections.titles.notificationForCreator"
                    )}
                  </div>
                  <Row>
                    <Col lg={12}>
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.titleNotificationForCreator)
                        )}
                        message={model.errors?.titleNotificationForCreator}
                      >
                        <InputText
                          maxLength={225}
                          showCount
                          label={translate(
                            "workflowDirections.titleNotification"
                          )}
                          isMaterial={true}
                          value={model.titleNotificationForCreator}
                          placeHolder={translate(
                            "workflowDirections.placeholder.titleNotification"
                          )}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(
                              model.titleNotificationForCreator
                            ),
                          })}
                          type={0}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={24} className="m-t--xs">
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model.errors,
                          nameof(model.contentNotificationForCreator)
                        )}
                        message={model.errors?.contentNotificationForCreator}
                      >
                        {/* <FroalaEditor
                          value={model.contentNotificationForCreator}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(
                              model.contentNotificationForCreator
                            ),
                          })}
                          placeholder={translate(
                            "workflowDirections.placeholder.content"
                          )}
                        /> */}
                        <textarea
                          id="noti_creator"
                          name="noti_creator"
                          onChange={handleChangeNotificationContent(
                            "contentNotificationForCreator"
                          )}
                          value={
                            model.contentNotificationForCreator
                              ? model.contentNotificationForCreator
                              : ""
                          }
                          className="w-100"
                          placeholder={translate(
                            "workflowDirections.placeholder.content"
                          )}
                        ></textarea>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="m-t--xs">
                <Col span={12} className="p-l--xxxs p-r--sm">
                  <div className="page-detail__title p-b--xxs">
                    {translate(
                      "workflowDirections.titles.notificationForNextStep"
                    )}
                  </div>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.titleNotificationForNextStep)
                        )}
                        message={model.errors?.titleNotificationForNextStep}
                      >
                        <InputText
                          maxLength={225}
                          showCount
                          label={translate(
                            "workflowDirections.titleNotification"
                          )}
                          isMaterial={true}
                          value={model.titleNotificationForNextStep}
                          placeHolder={translate(
                            "workflowDirections.placeholder.titleNotification"
                          )}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(
                              model.titleNotificationForNextStep
                            ),
                          })}
                          type={0}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={24} className="m-t--xs">
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model.errors,
                          nameof(model.contentNotificationForNextStep)
                        )}
                        message={model.errors?.contentNotificationForNextStep}
                      >
                        {/* <FroalaEditor
                          value={model.contentNotificationForNextStep}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(
                              model.contentNotificationForNextStep
                            ),
                          })}
                          placeholder={translate(
                            "workflowDirections.placeholder.content"
                          )}
                        /> */}
                        <textarea
                          id="noti_next_step"
                          name="noti_next_step"
                          onChange={handleChangeNotificationContent(
                            "contentNotificationForNextStep"
                          )}
                          value={
                            model.contentNotificationForNextStep
                              ? model.contentNotificationForNextStep
                              : ""
                          }
                          className="w-100"
                          placeholder={translate(
                            "workflowDirections.placeholder.content"
                          )}
                        ></textarea>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </TabPane>
            <TabPane
              key="3"
              tab={translate(
                "workflowDirections.tabs.workflowDirectionCondition"
              )}
            >
              <Row className="p-t--xxs">
                <Col lg={24}>
                  <div className="d-flex justify-content-end">
                    <Button
                      type="primary"
                      className="btn--lg"
                      icon={<Add16 />}
                      onClick={handleAddWorkflowDirectionConditionContent}
                    >
                      {translate("workflowDirections.button.addCondition")}
                    </Button>
                  </div>
                  <div className="condition-table">
                    {workflowDirectionConditionTable}
                  </div>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
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
                onClick={handleSaveModel}
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

export default WorkflowDirectionDetail;
