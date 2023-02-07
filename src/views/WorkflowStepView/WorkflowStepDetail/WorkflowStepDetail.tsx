/* begin general import */
import { Close16, Send16 } from "@carbon/icons-react";
import { Col, Row, Switch, Tabs } from "antd";
import PageHeader from "components/PageHeader/PageHeader";
import { WORKFLOW_STEP_ROUTE } from "config/route-consts";
import { WorkflowStep } from "models/WorkflowStep";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react3l-ui-library";
import FormItem from "react3l-ui-library/build/components/FormItem";
/* end general import */
/* begin individual import */
import InputText from "react3l-ui-library/build/components/Input/InputText";
import Select from "react3l-ui-library/build/components/Select/SingleSelect/Select";
import { detailService } from "services/detail-service";
import { fieldService } from "services/field-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
import { workflowStepRepository } from "repositories/workflow-step-repository";
import { WorkflowDefinitionFilter } from "models/WorkflowDefinition";
import { RoleFilter } from "models/Role";
import FroalaEditor from "components/FroalaEditor/FroalaEditor";

/* end individual import */

const { TabPane } = Tabs;

function WorkflowStepDetail() {
  const [translate] = useTranslation();

  const { model, dispatch } =
    detailService.useModel<WorkflowStep>(WorkflowStep);

  const { isDetail } = detailService.useGetIsDetail<WorkflowStep>(
    workflowStepRepository.get,
    dispatch
  );

  const {
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeSelectField,
  } = fieldService.useField(model, dispatch);

  const { handleSaveModel, handleGoMaster } =
    detailService.useActionsDetail<WorkflowStep>(
      model,
      workflowStepRepository.save,
      handleChangeAllField,
      WORKFLOW_STEP_ROUTE
    );

  const handleChangeWorkflowDefinition = React.useCallback(
    () => (idValue: number, value: any) => {
      const newModel = { ...model };
      newModel["role"] = undefined;
      newModel["roleId"] = null;
      newModel["workflowDefinitionId"] = idValue;
      newModel["workflowDefinition"] = value;
      handleChangeAllField(newModel);
    },
    [handleChangeAllField, model]
  );

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
  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("workflowSteps.master.subHeader")}
          breadcrumbItems={[
            translate("workflowSteps.master.header"),
            translate("workflowSteps.master.subHeader"),
          ]}
        />
        <div className="page page-detail p-t--lg p-l--xxl p-r--xxl p-b--lg">
          <div className="page-detail__title p-b--lg">
            {!isDetail
              ? translate("general.actions.create")
              : translate("general.detail.title")}
          </div>
          <Row>
            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.workflowDefinition)
                )}
                message={model.errors?.workflowDefinition}
              >
                <Select
                  isRequired
                  label={translate("workflowSteps.workflowDefinition")}
                  type={0}
                  classFilter={WorkflowDefinitionFilter}
                  searchProperty={"name"}
                  placeHolder={translate(
                    "workflowSteps.placeholder.workflowDefinition"
                  )}
                  getList={workflowStepRepository.singleListWorkflowDefinition}
                  onChange={handleChangeWorkflowDefinition()}
                  value={model.workflowDefinition}
                  disabled={isDetail}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.code)
                )}
                message={model.errors?.code}
              >
                <InputText
                  isRequired
                  label={translate("workflowSteps.code")}
                  type={0}
                  value={model.code}
                  placeHolder={translate("workflowSteps.placeholder.code")}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.code),
                  })}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.name)
                )}
                message={model.errors?.name}
              >
                <InputText
                  isRequired
                  label={translate("workflowSteps.name")}
                  type={0}
                  value={model.name}
                  placeHolder={translate("workflowSteps.placeholder.name")}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.name),
                  })}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.role)
                )}
                message={model.errors?.role}
              >
                <Select
                  isRequired
                  label={translate("workflowSteps.role")}
                  type={0}
                  classFilter={RoleFilter}
                  searchProperty={"name"}
                  placeHolder={translate("workflowSteps.placeholder.role")}
                  getList={workflowStepRepository.singleListRole}
                  onChange={handleChangeSelectField({
                    fieldName: nameof(model.role),
                  })}
                  valueFilter={{
                    ...new RoleFilter(),
                    siteId: { equal: model?.workflowDefinition?.siteId },
                  }}
                  value={model.role}
                  disabled={!model?.workflowDefinitionId}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.status)
                )}
                message={model.errors?.status}
              >
                <div>
                  <div className="label-status">
                    {translate("workflowSteps.status")}
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
            <TabPane key="1" tab={translate("workflowSteps.tabs.mailConfig")}>
              <Row className="m-t--xs">
                <Col span={12} className="p-l--xxxs p-r--sm">
                  <div className="page-detail__title p-b--xxs">
                    {translate("workflowSteps.titles.mailForRejectStep")}
                  </div>
                  <Row>
                    <Col lg={12}>
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.subjectMailForReject)
                        )}
                        message={model.errors?.subjectMailForReject}
                      >
                        <InputText
                          maxLength={225}
                          showCount
                          label={translate("workflowSteps.subjectMail")}
                          value={model.subjectMailForReject}
                          placeHolder={translate(
                            "workflowSteps.placeholder.subjectMail"
                          )}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.subjectMailForReject),
                          })}
                          type={0}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={24} className={`m-t--xs `}>
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.bodyMailForReject)
                        )}
                        message={model.errors?.bodyMailForReject}
                      >
                        <FroalaEditor
                          value={model.bodyMailForReject}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.bodyMailForReject),
                          })}
                          placeholder={translate(
                            "workflowSteps.placeholder.content"
                          )}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <div className="page-detail__title p-b--xxs">
                    {translate("workflowSteps.titles.mailForTerminate")}
                  </div>
                  <Row>
                    <Col lg={12} className="">
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.subjectMailForTerminate)
                        )}
                        message={model.errors?.subjectMailForTerminate}
                      >
                        <InputText
                          maxLength={225}
                          showCount
                          label={translate("workflowSteps.subjectMail")}
                          isMaterial={true}
                          value={model.subjectMailForTerminate}
                          placeHolder={translate(
                            "workflowSteps.placeholder.subjectMail"
                          )}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.subjectMailForTerminate),
                          })}
                          type={0}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={24} className="m-t--xs">
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model.errors,
                          nameof(model.bodyMailForTerminate)
                        )}
                        message={model.errors?.bodyMailForTerminate}
                      >
                        <FroalaEditor
                          value={model.bodyMailForTerminate}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.bodyMailForTerminate),
                          })}
                          placeholder={translate(
                            "workflowSteps.placeholder.content"
                          )}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </TabPane>
            <TabPane key="2" tab={translate("workflowSteps.tabs.notiConfig")}>
              <Row className="m-t--xs">
                <Col span={12} className="p-l--xxxs p-r--sm">
                  <div className="page-detail__title p-b--xxs">
                    {translate("workflowSteps.titles.notificationForReject")}
                  </div>
                  <Row>
                    <Col lg={12}>
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.titleNotificationForReject)
                        )}
                        message={model.errors?.titleNotificationForReject}
                      >
                        <InputText
                          maxLength={225}
                          showCount
                          label={translate("workflowSteps.titleNotification")}
                          value={model.titleNotificationForReject}
                          placeHolder={translate(
                            "workflowSteps.placeholder.titleNotification"
                          )}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(model.titleNotificationForReject),
                          })}
                          type={0}
                        />
                      </FormItem>
                    </Col>

                    <Col lg={24} className="m-t--xs">
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.contentNotificationForReject)
                        )}
                        message={model.errors?.contentNotificationForReject}
                      >
                        <textarea
                          id="noti_reject"
                          name="noti_reject"
                          onChange={handleChangeNotificationContent(
                            "contentNotificationForReject"
                          )}
                          value={
                            model.contentNotificationForReject
                              ? model.contentNotificationForReject
                              : ""
                          }
                          className="w-100"
                          placeholder={translate(
                            "workflowSteps.placeholder.content"
                          )}
                        ></textarea>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <div className="page-detail__title p-b--xxs">
                    {translate("workflowSteps.titles.notificationForTerminate")}
                  </div>
                  <Row>
                    <Col lg={12}>
                      <FormItem
                        validateStatus={utilService.getValidateStatus(
                          model,
                          nameof(model.titleNotificationForTerminate)
                        )}
                        message={model.errors?.titleNotificationForTerminate}
                      >
                        <InputText
                          maxLength={225}
                          showCount
                          label={translate("workflowSteps.titleNotification")}
                          isMaterial={true}
                          value={model.titleNotificationForTerminate}
                          placeHolder={translate(
                            "workflowSteps.placeholder.titleNotification"
                          )}
                          className={"tio-account_square_outlined"}
                          onChange={handleChangeSingleField({
                            fieldName: nameof(
                              model.titleNotificationForTerminate
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
                          nameof(model.contentNotificationForTerminate)
                        )}
                        message={model.errors?.contentNotificationForTerminate}
                      >
                        <textarea
                          id="noti_terminate"
                          name="noti_terminate"
                          onChange={handleChangeNotificationContent(
                            "contentNotificationForTerminate"
                          )}
                          value={
                            model.contentNotificationForTerminate
                              ? model.contentNotificationForTerminate
                              : ""
                          }
                          className="w-100"
                          placeholder={translate(
                            "workflowSteps.placeholder.content"
                          )}
                        ></textarea>
                      </FormItem>
                    </Col>
                  </Row>
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

export default WorkflowStepDetail;
