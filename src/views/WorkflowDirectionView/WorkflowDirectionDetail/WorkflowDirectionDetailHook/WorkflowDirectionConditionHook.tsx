import { TrashCan16 } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { renderMasterIndex } from "helpers/table";
import { WorkflowDirection } from "models/WorkflowDirection";
import {
  WorkflowDirectionCondition,
  WorkflowDirectionConditionFilter,
} from "models/WorkflowDirectionCondition";
import { WorkflowOperatorFilter } from "models/WorkflowOperator";
import { WorkflowParameterFilter } from "models/WorkflowParameter";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FormItem, LayoutCell, LayoutHeader, Select } from "react3l-ui-library";
import { workflowDirectionRepository } from "repositories/workflow-direction-repository";
import { detailService } from "services/detail-service";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";
import { tableService } from "services/table-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
import FieldInput from "../FieldInput";

export function useWorkflowDirectionConditionTable(
  model: WorkflowDirection,
  setModel: (data: WorkflowDirection) => void
) {
  const [translate] = useTranslation();

  const {
    content: workflowDirectionConditions,
    setContent: setWorkflowDirectionConditions,
  } = detailService.useContentList(
    model,
    setModel,
    nameof(model.workflowDirectionConditions)
  );
  const count = workflowDirectionConditions?.length;
  const [
    workflowDirectionConditionFilter,
    dispatWorkflowDirectionConditionFilter,
  ] = React.useReducer<
    React.Reducer<
      WorkflowDirectionConditionFilter,
      FilterAction<WorkflowDirectionConditionFilter>
    >
  >(filterReducer, new WorkflowDirectionConditionFilter());

  const { handleChangeAllFilter, setLoadList, handleSearch } =
    filterService.useFilter<WorkflowDirectionConditionFilter>(
      workflowDirectionConditionFilter,
      dispatWorkflowDirectionConditionFilter
    );

  const {
    handleTableChange,
    handlePagination,
    canBulkDelete,
    handleLocalDelete,
    handleLocalBulkDelete,
    handleAddContent,
  } = tableService.useLocalTable<
    WorkflowDirectionCondition,
    any,
    WorkflowDirectionConditionFilter
  >(
    workflowDirectionConditionFilter,
    handleChangeAllFilter,
    setLoadList,
    handleSearch,
    count,
    workflowDirectionConditions,
    setWorkflowDirectionConditions,
    WorkflowDirectionCondition
  );
  const handleChangeWorkflowType = React.useCallback(
    (index: number) => (value: any, object?: any) => {
      const newModel = [...workflowDirectionConditions];
      newModel[index]["workflowParameter"] = object;
      newModel[index]["workflowParameterId"] = value;
      newModel[index]["value"] = undefined;

      setWorkflowDirectionConditions(newModel);
    },
    [workflowDirectionConditions, setWorkflowDirectionConditions]
  );
  const handleChangeworkflowOperator = React.useCallback(
    (index: number) => (value: any, object?: any) => {
      const newModel = [...workflowDirectionConditions];
      newModel[index]["workflowOperator"] = object;
      newModel[index]["workflowOperatorId"] = value;
      setWorkflowDirectionConditions(newModel);
    },
    [workflowDirectionConditions, setWorkflowDirectionConditions]
  );
  const workflowDirectionConditionColumns: ColumnProps<WorkflowDirection>[] =
    useMemo(() => {
      return [
        {
          title: (
            <LayoutHeader
              orderType="left"
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
          key: nameof(workflowDirectionConditions[0].workflowParameter),
          dataIndex: nameof(workflowDirectionConditions[0].workflowParameter),

          ellipsis: true,
          render(...params: [string, WorkflowDirectionCondition, number]) {
            const workflowParameterFilter = new WorkflowParameterFilter();
            workflowParameterFilter.workflowTypeId.equal =
              model?.workflowDefinition?.workflowTypeId;
            return (
              <LayoutCell orderType="left" tableSize="lg">
                <FormItem
                  validateStatus={utilService.getValidateStatus(
                    workflowDirectionConditions[params[2]],
                    nameof(
                      workflowDirectionConditions[params[2]].workflowParameterId
                    )
                  )}
                  message={
                    workflowDirectionConditions[params[2]].errors
                      ?.workflowParameterId
                  }
                >
                  <Select
                    isMaterial={true}
                    classFilter={WorkflowParameterFilter}
                    placeHolder={translate(
                      "workflowDirections.workflowDirectionConditions.placeholder.workflowParameter"
                    )}
                    getList={
                      workflowDirectionRepository.singleListWorkflowParameter
                    }
                    onChange={handleChangeWorkflowType(params[2])}
                    value={params[1].workflowParameter}
                    disabled={model.workflowDefinitionId ? false : true}
                    valueFilter={workflowParameterFilter}
                    appendToBody
                    type={0}
                  />
                </FormItem>
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
          key: nameof(workflowDirectionConditions[0].workflowOperator),
          dataIndex: nameof(workflowDirectionConditions[0].workflowOperator),

          ellipsis: true,
          render(...params: [string, WorkflowDirectionCondition, number]) {
            const workflowOperatorFilter = new WorkflowOperatorFilter();
            workflowOperatorFilter.workflowParameterTypeId.equal =
              params[1]?.workflowParameter?.workflowParameterTypeId;
            return (
              <LayoutCell orderType="left" tableSize="lg">
                {workflowDirectionConditions[params[2]]?.workflowParameterId &&
                workflowDirectionConditions[params[2]]?.workflowParameter ? (
                  <FormItem
                    validateStatus={utilService.getValidateStatus(
                      workflowDirectionConditions[params[2]],
                      nameof(
                        workflowDirectionConditions[params[2]].workflowOperator
                      )
                    )}
                    message={
                      workflowDirectionConditions[params[2]].errors
                        ?.workflowOperator
                    }
                  >
                    <Select
                      isMaterial={true}
                      classFilter={WorkflowOperatorFilter}
                      valueFilter={workflowOperatorFilter}
                      placeHolder={translate(
                        "workflowDirections.workflowDirectionConditions.placeholder.workflowOperator"
                      )}
                      getList={
                        workflowDirectionRepository.singleListWorkflowOperator
                      }
                      onChange={handleChangeworkflowOperator(params[2])}
                      value={params[1].workflowOperator}
                      disabled={model.workflowDefinitionId ? false : true}
                      appendToBody
                      type={0}
                    />
                  </FormItem>
                ) : (
                  <></>
                )}
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <LayoutHeader
              orderType="left"
              title={translate(
                "workflowDirections.workflowDirectionConditions.value"
              )}
            />
          ),
          key: nameof(workflowDirectionConditions[0].value),
          dataIndex: nameof(workflowDirectionConditions[0].value),
          ellipsis: true,
          render(...params: [string, WorkflowDirectionCondition, number]) {
            const workflowOperatorFilter = new WorkflowOperatorFilter();
            workflowOperatorFilter.workflowParameterTypeId.equal =
              params[1]?.workflowParameter?.workflowParameterTypeId;
            return (
              <LayoutCell orderType="left" tableSize="lg">
                {workflowDirectionConditions[params[2]]?.workflowOperatorId &&
                workflowDirectionConditions[params[2]]?.workflowParameterId &&
                workflowDirectionConditions[params[2]]?.workflowOperator &&
                workflowDirectionConditions[params[2]]?.workflowParameter ? (
                  <FormItem
                    validateStatus={utilService.getValidateStatus(
                      workflowDirectionConditions[params[2]],
                      nameof(workflowDirectionConditions[params[2]].value)
                    )}
                    message={
                      workflowDirectionConditions[params[2]].errors?.value
                    }
                  >
                    <FieldInput
                      value={params[0]}
                      index={params[2]}
                      record={params[1]}
                      contents={workflowDirectionConditions}
                      setContents={setWorkflowDirectionConditions}
                      disabled={
                        params[1].workflowOperatorId === undefined ||
                        params[1].workflowOperatorId === 0 ||
                        typeof params[1].errors?.workflowOperatorId ===
                          "string" ||
                        model.used
                      }
                      type={
                        params[1]?.workflowParameter?.workflowParameterTypeId
                      }
                    />
                  </FormItem>
                ) : (
                  <></>
                )}
              </LayoutCell>
            );
          },
        },
        {
          title: (
            <LayoutHeader
              orderType="right"
              title={translate("general.actions.label")}
            />
          ),
          key: "action",
          dataIndex: nameof(workflowDirectionConditions[0].id),
          fixed: "right",
          width: 150,
          align: "center",
          render(...params: [string, WorkflowDirectionCondition, number]) {
            return (
              <TrashCan16
                color="red"
                onClick={() => handleLocalDelete(params[1])}
              />
            );
          },
        },
      ];
    }, [
      handleChangeWorkflowType,
      handleChangeworkflowOperator,
      handleLocalDelete,
      model.used,
      model?.workflowDefinition?.workflowTypeId,
      model.workflowDefinitionId,
      setWorkflowDirectionConditions,
      translate,
      workflowDirectionConditions,
    ]);

  return {
    workflowDirectionConditionFilter,
    workflowDirectionConditionList: workflowDirectionConditions,
    workflowDirectionConditionTotal: count,
    handleAddWorkflowDirectionConditionContent: handleAddContent,
    handleWorkflowDirectionConditionTableChange: handleTableChange,
    handleWorkflowDirectionConditionPagination: handlePagination,
    canBulkDeleteWorkflowDirectionConditionContent: canBulkDelete,
    handleLocalBulkDeleteWorkflowDirectionConditionContent:
      handleLocalBulkDelete,
    workflowDirectionConditionColumns,
  };
}
