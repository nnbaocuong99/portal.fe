/* begin general import */
import { WorkflowParameterFilter } from "models/WorkflowParameter";
import { WorkflowParameterTypeFilter } from "models/WorkflowParameterType";
import { WorkflowTypeFilter } from "models/WorkflowType";
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
import { workflowParameterRepository } from "repositories/workflow-parameter-repository";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";
/* end individual import */

export interface WorkflowParameterFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function WorkflowParameterAdvanceFilter(props: WorkflowParameterFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<WorkflowParameterFilter, FilterAction<WorkflowParameterFilter>>
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
      payload: new WorkflowParameterFilter(),
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
          label={translate("workflowParameters.code")}
          showCount={true}
          maxLength={100}
          value={modelFilter["code"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "code",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("workflowParameters.placeholder.code")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("workflowParameters.name")}
          showCount={true}
          maxLength={100}
          value={modelFilter["name"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "name",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("workflowParameters.placeholder.name")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["workflowParameterTypeValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "workflowParameterType",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={WorkflowParameterTypeFilter}
          getList={workflowParameterRepository.filterListWorkflowParameterType}
          placeHolder={translate(
            "workflowParameters.placeholder.workflowParameterType"
          )}
          label={translate("workflowParameters.workflowParameterType")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["workflowTypeValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "workflowType",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={WorkflowTypeFilter}
          getList={workflowParameterRepository.filterListWorkflowType}
          placeHolder={translate("workflowParameters.placeholder.workflowType")}
          label={translate("workflowParameters.workflowType")}
        />
      </div>
    </Drawer>
  );
}

export default WorkflowParameterAdvanceFilter;
