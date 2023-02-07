/* begin general import */
import { Col, Row } from "antd";
import { ASSETS_SVG } from "config/consts";
import { WorkflowDirectionFilter } from "models/WorkflowDirection";
import { WorkflowDirectionCondition } from "models/WorkflowDirectionCondition";
import { WorkflowOperatorFilter } from "models/WorkflowOperator";
import { WorkflowParameterFilter } from "models/WorkflowParameter";
import { Moment } from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { Model } from "react3l-common";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import FormItem from "react3l-ui-library/build/components/FormItem";
/* end general import */
/* begin individual import */
import InputText from "react3l-ui-library/build/components/Input/InputText";
import Select from "react3l-ui-library/build/components/Select/SingleSelect/Select";
import { workflowDirectionConditionRepository } from "repositories/workflow-direction-condition-repository";
import { ModelAction } from "services/detail-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";

/* end individual import */

interface WorkflowDirectionConditionDetailDrawerProps extends DrawerProps {
  model: WorkflowDirectionCondition;
  handleChangeSingleField?: (config: {
    fieldName: string;
  }) => (value: any) => void;
  handleChangeSelectField?: (config: {
    fieldName: string;
  }) => (idValue: number, value: Model) => void;
  handleChangeTreeField?: (config: {
    fieldName: string;
  }) => (values: any[], isMultiple: boolean) => void;
  handleChangeDateField?: (config: {
    fieldName: string | [string, string];
  }) => (date: Moment | [Moment, Moment]) => void;
  dispatch?: React.Dispatch<ModelAction<WorkflowDirectionCondition>>;
  loading?: boolean;
}

function WorkflowDirectionConditionDetailDrawer(
  props: WorkflowDirectionConditionDetailDrawerProps
) {
  const [translate] = useTranslation();

  const {
    model,
    handleChangeSingleField,
    handleChangeSelectField,
    loading,
    visible,
    handleSave,
    handleCancel,
  } = props;

  return (
    <Drawer
      {...props}
      visible={visible}
      handleSave={handleSave}
      handleCancel={handleCancel}
      handleClose={handleCancel}
      visibleFooter={true}
      title={
        model?.id
          ? translate("general.detail.title")
          : translate("general.actions.create")
      }
      titleButtonCancel={translate("general.actions.cancel")}
      titleButtonApply={translate("general.actions.apply")}
    >
      {loading ? (
        <div className="loading-block">
          <img src={ASSETS_SVG + "/spinner.svg"} alt="Loading..." />
        </div>
      ) : (
        <div className="page page__detail">
          <div className="w-100 page__detail-tabs">
            <Row className="d-flex">
              <Col lg={24}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col lg={12} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.value)
                      )}
                      message={model.errors?.value}
                    >
                      <InputText
                        label={translate("workflowDirectionConditions.value")}
                        type={0}
                        value={model.value}
                        placeHolder={translate(
                          "workflowDirectionConditions.placeholder.value"
                        )}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.value),
                        })}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={12} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.workflowDirection)
                      )}
                      message={model.errors?.workflowDirection}
                    >
                      <Select
                        label={translate(
                          "workflowDirectionConditions.workflowDirection"
                        )}
                        type={0}
                        classFilter={WorkflowDirectionFilter}
                        searchProperty={"name"}
                        placeHolder={translate(
                          "workflowDirectionConditions.placeholder.workflowDirection"
                        )}
                        getList={
                          workflowDirectionConditionRepository.singleListWorkflowDirection
                        }
                        onChange={handleChangeSelectField({
                          fieldName: nameof(model.workflowDirection),
                        })}
                        value={model.workflowDirection}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={12} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.workflowOperator)
                      )}
                      message={model.errors?.workflowOperator}
                    >
                      <Select
                        label={translate(
                          "workflowDirectionConditions.workflowOperator"
                        )}
                        type={0}
                        classFilter={WorkflowOperatorFilter}
                        searchProperty={"name"}
                        placeHolder={translate(
                          "workflowDirectionConditions.placeholder.workflowOperator"
                        )}
                        getList={
                          workflowDirectionConditionRepository.singleListWorkflowOperator
                        }
                        onChange={handleChangeSelectField({
                          fieldName: nameof(model.workflowOperator),
                        })}
                        value={model.workflowOperator}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={12} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.workflowParameter)
                      )}
                      message={model.errors?.workflowParameter}
                    >
                      <Select
                        label={translate(
                          "workflowDirectionConditions.workflowParameter"
                        )}
                        type={0}
                        classFilter={WorkflowParameterFilter}
                        searchProperty={"name"}
                        placeHolder={translate(
                          "workflowDirectionConditions.placeholder.workflowParameter"
                        )}
                        getList={
                          workflowDirectionConditionRepository.singleListWorkflowParameter
                        }
                        onChange={handleChangeSelectField({
                          fieldName: nameof(model.workflowParameter),
                        })}
                        value={model.workflowParameter}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default WorkflowDirectionConditionDetailDrawer;
