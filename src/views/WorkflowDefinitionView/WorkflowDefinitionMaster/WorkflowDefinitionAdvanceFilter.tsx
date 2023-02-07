/* begin general import */
import { OrganizationFilter } from "models/Organization";
import { StatusFilter } from "models/Status";
import { WorkflowDefinitionFilter } from "models/WorkflowDefinition";
import { WorkflowTypeFilter } from "models/WorkflowType";
import React from "react";
import { useTranslation } from "react-i18next";
import { IdFilter, StringFilter } from "react3l-advanced-filters";
import {
  AdvanceIdFilter,
  AdvanceStringFilter,
  AdvanceTreeFilter,
} from "react3l-ui-library";

import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import { Reducer } from "redux";
/* end filter import */
/* begin individual import */
import { workflowDefinitionRepository } from "repositories/workflow-definition-repository";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";

/* end individual import */

export interface WorkflowDefinitionFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function WorkflowDefinitionAdvanceFilter(props: WorkflowDefinitionFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<WorkflowDefinitionFilter, FilterAction<WorkflowDefinitionFilter>>
  >(filterReducer, filter);

  const {
    handleChangeSelectFilter,
    handleChangeSingleTreeFilter,
    handleChangeInputFilter,
  } = filterService.useFilter(filter, setModelFilter);

  const handleSaveModelFilter = React.useCallback(() => {
    handleChangeAllFilter(modelFilter);
    setVisible(false);
  }, [handleChangeAllFilter, modelFilter, setVisible]);

  const handleClearModelFilter = React.useCallback(() => {
    setModelFilter({
      type: 0,
      payload: new WorkflowDefinitionFilter(),
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
      <div className="d-flex m-t--xxs">
        <AdvanceStringFilter
          maxLength={100}
          value={modelFilter["code"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "code",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          label={translate("workflowDefinitions.code")}
          placeHolder={translate("workflowDefinitions.placeholder.code")}
        />
      </div>

      <div className="d-flex m-t--xxs">
        <AdvanceStringFilter
          maxLength={100}
          value={modelFilter["name"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "name",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          label={translate("workflowDefinitions.name")}
          placeHolder={translate("workflowDefinitions.placeholder.name")}
        />
      </div>
      <div className="d-flex m-t--xxs">
        <AdvanceIdFilter
          value={modelFilter["workflowTypeValue"]}
          placeHolder={translate(
            "workflowDefinitions.placeholder.workflowType"
          )}
          classFilter={WorkflowTypeFilter}
          onChange={handleChangeSelectFilter({
            fieldName: "workflowType",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          getList={workflowDefinitionRepository.filterListWorkflowType}
          label={translate("workflowDefinitions.workflowType")}
        />
      </div>
      <div className="d-flex m-t--xxs">
        <AdvanceIdFilter
          value={modelFilter["statusValue"]}
          placeHolder={translate("workflowDefinitions.placeholder.status")}
          classFilter={StatusFilter}
          onChange={handleChangeSelectFilter({
            fieldName: "status",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          getList={workflowDefinitionRepository.filterListStatus}
          label={translate("workflowDefinitions.status")}
        />
      </div>

      <div className="d-flex m-t--xxs">
        <AdvanceTreeFilter
          onChange={handleChangeSingleTreeFilter({
            fieldName: "organization",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          placeHolder={translate(
            "workflowDefinitions.placeholder.organization"
          )}
          label={translate("workflowDefinitions.organization")}
          getTreeData={workflowDefinitionRepository.filterListOrganization}
          checkStrictly={true}
          classFilter={OrganizationFilter}
          item={modelFilter["organizationValue"]}
        />
      </div>
    </Drawer>
  );
}

export default WorkflowDefinitionAdvanceFilter;
