/* begin general import */
import { RoleFilter } from "models/Role";
import { StatusFilter } from "models/Status";
import { WorkflowDefinitionFilter } from "models/WorkflowDefinition";
import { WorkflowStepFilter } from "models/WorkflowStep";
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
import { workflowStepRepository } from "repositories/workflow-step-repository";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";

/* end individual import */

export interface WorkflowStepFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function WorkflowStepAdvanceFilter(props: WorkflowStepFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<WorkflowStepFilter, FilterAction<WorkflowStepFilter>>
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
      payload: new WorkflowStepFilter(),
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
          label={translate("workflowSteps.code")}
          showCount={true}
          maxLength={100}
          value={modelFilter["code"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "code",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("workflowSteps.placeholder.code")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("workflowSteps.name")}
          showCount={true}
          maxLength={100}
          value={modelFilter["name"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "name",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("workflowSteps.placeholder.name")}
        />
      </div>
      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["workflowDefinitionValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "workflowDefinition",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={WorkflowDefinitionFilter}
          getList={workflowStepRepository.filterListWorkflowDefinition}
          placeHolder={translate(
            "workflowSteps.placeholder.workflowDefinition"
          )}
          label={translate("workflowSteps.workflowDefinition")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["roleValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "role",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={RoleFilter}
          getList={workflowStepRepository.filterListRole}
          placeHolder={translate("workflowSteps.placeholder.role")}
          label={translate("workflowSteps.role")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["statusValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "status",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={StatusFilter}
          getList={workflowStepRepository.filterListStatus}
          placeHolder={translate("workflowSteps.placeholder.status")}
          label={translate("workflowSteps.status")}
        />
      </div>
    </Drawer>
  );
}

export default WorkflowStepAdvanceFilter;
