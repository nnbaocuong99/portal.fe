/* begin general import */
import { StatusFilter } from "models/Status";
import { WorkflowDefinitionFilter } from "models/WorkflowDefinition";
import { WorkflowDirectionFilter } from "models/WorkflowDirection";
import { WorkflowStepFilter } from "models/WorkflowStep";
import React from "react";
import { useTranslation } from "react-i18next";
import { IdFilter } from "react3l-advanced-filters";
import { AdvanceIdFilter } from "react3l-ui-library";
/* end general import */
/* begin filter import */
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import { Reducer } from "redux";
/* end filter import */
/* begin individual import */
import { workflowDirectionRepository } from "repositories/workflow-direction-repository";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";
/* end individual import */

export interface WorkflowDirectionFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function WorkflowDirectionAdvanceFilter(props: WorkflowDirectionFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<WorkflowDirectionFilter, FilterAction<WorkflowDirectionFilter>>
  >(filterReducer, filter);

  const { handleChangeSelectFilter } = filterService.useFilter(
    filter,
    setModelFilter
  );

  const handleSaveModelFilter = React.useCallback(() => {
    handleChangeAllFilter(modelFilter);
    setVisible(false);
  }, [handleChangeAllFilter, modelFilter, setVisible]);

  const handleClearModelFilter = React.useCallback(() => {
    setModelFilter({
      type: 0,
      payload: new WorkflowDirectionFilter(),
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
        <AdvanceIdFilter
          value={modelFilter["statusValue"]}
          placeHolder={translate("workflowDirections.placeholder.status")}
          classFilter={StatusFilter}
          onChange={handleChangeSelectFilter({
            fieldName: "status",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          getList={workflowDirectionRepository.filterListStatus}
          label={translate("workflowDirections.status")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["workflowDefinitionValue"]}
          placeHolder={translate(
            "workflowDirections.placeholder.workflowDefinition"
          )}
          classFilter={WorkflowDefinitionFilter}
          onChange={handleChangeSelectFilter({
            fieldName: "workflowDefinition",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          getList={workflowDirectionRepository.filterListWorkflowDefinition}
          label={translate("workflowDirections.workflowDefinition")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["fromStepValue"]}
          placeHolder={translate("workflowDirections.placeholder.fromStep")}
          classFilter={WorkflowStepFilter}
          onChange={handleChangeSelectFilter({
            fieldName: "fromStep",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          valueFilter={{
            ...new WorkflowStepFilter(),
            workflowDefinitionId: {
              equal: modelFilter["workflowDefinitionId"]["equal"],
            },
          }}
          getList={workflowDirectionRepository.filterListWorkflowStep}
          label={translate("workflowDirections.fromStep")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["toStepValue"]}
          placeHolder={translate("workflowDirections.placeholder.toStep")}
          classFilter={WorkflowStepFilter}
          onChange={handleChangeSelectFilter({
            fieldName: "toStep",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          valueFilter={{
            ...new WorkflowStepFilter(),
            workflowDefinitionId: {
              equal: modelFilter["workflowDefinitionId"]["equal"],
            },
          }}
          getList={workflowDirectionRepository.filterListWorkflowStep}
          label={translate("workflowDirections.toStep")}
        />
      </div>
    </Drawer>
  );
}

export default WorkflowDirectionAdvanceFilter;
