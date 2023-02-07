/* begin general import */
import { WorkflowDirectionFilter } from "models/WorkflowDirection";
import { WorkflowDirectionConditionFilter } from "models/WorkflowDirectionCondition";
import { WorkflowOperatorFilter } from "models/WorkflowOperator";
import { WorkflowParameterFilter } from "models/WorkflowParameter";
import React from "react";
import { useTranslation } from "react-i18next";
import { IdFilter, StringFilter } from "react3l-advanced-filters";
import AdvanceIdFilter from "react3l-ui-library/build/components/AdvanceFilter/AdvanceIdFilter";
/* end general import */
/* begin filter import */
import AdvanceStringFilter from "react3l-ui-library/build/components/AdvanceFilter/AdvanceStringFilter";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import { Reducer } from "redux";
/* end filter import */
/* begin individual import */
import { workflowDirectionConditionRepository } from "repositories/workflow-direction-condition-repository";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";
/* end individual import */

export interface WorkflowDirectionConditionFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function WorkflowDirectionConditionAdvanceFilter(
  props: WorkflowDirectionConditionFilterProps
) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<
      WorkflowDirectionConditionFilter,
      FilterAction<WorkflowDirectionConditionFilter>
    >
  >(filterReducer, filter);

  const { handleChangeInputFilter, handleChangeSelectFilter } =
    filterService.useFilter(filter, setModelFilter);

  const handleSaveModelFilter = React.useCallback(() => {
    handleChangeAllFilter(modelFilter);
    setVisible(false);
  }, [handleChangeAllFilter, modelFilter, setVisible]);

  const handleClearModelFilter = React.useCallback(() => {
    setModelFilter({
      type: 0,
      payload: new WorkflowDirectionConditionFilter(),
    });
  }, [setModelFilter]);

  return (
    <Drawer
      visible={visible}
      handleSave={handleSaveModelFilter}
      handleCancel={handleClearModelFilter}
      handleClose={handleClose}
      visibleFooter={true}
      loading={false}
      size={"sm"}
      title={translate("general.drawer.filter")}
      titleButtonCancel={translate("general.actions.clear")}
      titleButtonApply={translate("general.actions.apply")}
    >
      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("workflowDirectionConditions.value")}
          showCount={true}
          maxLength={100}
          value={modelFilter["value"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "value",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate(
            "workflowDirectionConditions.placeholder.value"
          )}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["workflowDirectionValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "workflowDirection",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={WorkflowDirectionFilter}
          getList={
            workflowDirectionConditionRepository.filterListWorkflowDirection
          }
          placeHolder={translate(
            "workflowDirectionConditions.placeholder.workflowDirection"
          )}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["workflowOperatorValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "workflowOperator",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={WorkflowOperatorFilter}
          getList={
            workflowDirectionConditionRepository.filterListWorkflowOperator
          }
          placeHolder={translate(
            "workflowDirectionConditions.placeholder.workflowOperator"
          )}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["workflowParameterValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "workflowParameter",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={WorkflowParameterFilter}
          getList={
            workflowDirectionConditionRepository.filterListWorkflowParameter
          }
          placeHolder={translate(
            "workflowDirectionConditions.placeholder.workflowParameter"
          )}
        />
      </div>
    </Drawer>
  );
}

export default WorkflowDirectionConditionAdvanceFilter;
