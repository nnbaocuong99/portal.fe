/* begin general import */
import { SettingsAdjust16, TrashCan16 } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import {
  WorkflowParameter,
  WorkflowParameterFilter,
} from "models/WorkflowParameter";
import {
  WorkflowParameterType,
  WorkflowParameterTypeFilter,
} from "models/WorkflowParameterType";
import { WorkflowType, WorkflowTypeFilter } from "models/WorkflowType";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IdFilter } from "react3l-advanced-filters";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
  TagFilter,
} from "react3l-ui-library";
/* end general import */
/* begin filter import */
import AdvanceIdFilterMaster from "react3l-ui-library/build/components/AdvanceFilterMaster/AdvanceIdFilterMaster";
import InputSearch from "react3l-ui-library/build/components/Input/InputSearch";
/* end filter import */
/* begin individual import */
import { workflowParameterRepository } from "repositories/workflow-parameter-repository";
import { filterService } from "services/filter-service";
import { listService } from "services/list-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import WorkflowParameterAdvanceFilter from "./WorkflowParameterAdvanceFilter";
/* end individual import */

function WorkflowParameterMaster() {
  const [translate] = useTranslation();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    WorkflowParameterFilter,
    { skip: 0, take: 10 }
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  const {
    value: filter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    handleChangeInputSearch,
  } = filterService.useFilter(modelFilter, dispatch);

  const { list, count, loadingList, handleResetList } = listService.useList(
    workflowParameterRepository.list,
    workflowParameterRepository.count,
    filter,
    handleChangeAllFilter
  );

  const { handleTableChange, handlePagination } = tableService.useTable(
    filter,
    handleChangeAllFilter
  );

  const {
    handleBulkAction,
    canBulkAction,
    selectedRowKeys,
    setSelectedRowKeys,
  } = listService.useRowSelection(
    workflowParameterRepository.delete,
    workflowParameterRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
  );

  const columns: ColumnProps<WorkflowParameter>[] = useMemo(
    () => [
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowParameters.code")}
          />
        ),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getAntOrderType<WorkflowParameter, WorkflowParameterFilter>(
          filter,
          nameof(list[0].code)
        ),
        width: 150,
        ellipsis: true,
        render(...params: [string, WorkflowParameter, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowParameters.name")}
          />
        ),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getAntOrderType<WorkflowParameter, WorkflowParameterFilter>(
          filter,
          nameof(list[0].name)
        ),
        width: 150,
        ellipsis: true,
        render(...params: [string, WorkflowParameter, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowParameters.workflowType")}
          />
        ),
        width: 150,
        key: nameof(list[0].workflowType),
        dataIndex: nameof(list[0].workflowType),
        sorter: true,
        sortOrder: getAntOrderType<WorkflowParameter, WorkflowParameterFilter>(
          filter,
          nameof(list[0].workflowType)
        ),
        ellipsis: true,
        render(workflowType: WorkflowType) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={workflowType.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowParameters.workflowParameterType")}
          />
        ),
        width: 150,
        key: nameof(list[0].workflowParameterType),
        dataIndex: nameof(list[0].workflowParameterType),
        sorter: true,
        sortOrder: getAntOrderType<WorkflowParameter, WorkflowParameterFilter>(
          filter,
          nameof(list[0].workflowParameterType)
        ),
        ellipsis: true,
        render(workflowParameterType: WorkflowParameterType) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={workflowParameterType.name} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, list, filter]
  );

  const handleCancel = React.useCallback(() => {
    setVisible(false);
  }, []);
  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("workflowParameters.master.subHeader")}
          breadcrumbItems={[
            translate("workflowParameters.master.header"),
            translate("workflowParameters.master.subHeader"),
          ]}
        />
        <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--xs p-b--xs">
            {translate("workflowParameters.master.title")}
          </div>
          <div className="page-master__content">
            <div className="page-master__tag-filter">
              <TagFilter
                value={filter}
                translate={translate}
                keyTranslate={"workflowParameters"}
                handleChangeFilter={handleChangeAllFilter}
                onClear={(value: any) => {
                  return 0;
                }}
              />
            </div>
            {(!selectedRowKeys || selectedRowKeys?.length === 0) && (
              <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
                <div className="page-master__filter d-flex align-items-center justify-content-start">
                  <div className="">
                    <AdvanceIdFilterMaster
                      value={
                        filter[nameof(list[0].workflowParameterTypeId)]["equal"]
                      }
                      placeHolder={translate(
                        "workflowParameters.placeholder.workflowParameterType"
                      )}
                      classFilter={WorkflowParameterTypeFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].workflowParameterType),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={
                        workflowParameterRepository.filterListWorkflowParameterType
                      }
                      title={translate(
                        "workflowParameters.workflowParameterType"
                      )}
                    />
                  </div>
                  <div className="">
                    <AdvanceIdFilterMaster
                      value={filter[nameof(list[0].workflowTypeId)]["equal"]}
                      placeHolder={translate(
                        "workflowParameters.placeholder.workflowType"
                      )}
                      classFilter={WorkflowTypeFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].workflowType),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={
                        workflowParameterRepository.filterListWorkflowType
                      }
                      title={translate("workflowParameters.workflowType")}
                    />
                  </div>
                </div>
                <div className="page-master__filter-action-search d-flex align-items-center">
                  <Button
                    type="icon-only-ghost"
                    icon={<SettingsAdjust16 />}
                    onClick={() => setVisible(true)}
                    className="btn--xl"
                  />
                  <InputSearch
                    valueFilter={filter}
                    classFilter={WorkflowParameterFilter}
                    placeHolder={translate("general.placeholder.search")}
                    onChange={handleChangeInputSearch}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="page-master__content-table">
            <ActionBarComponent
              selectedRowKeys={selectedRowKeys}
              setSelectedRowKeys={setSelectedRowKeys}
            >
              <Button
                icon={<TrashCan16 />}
                type="ghost-primary"
                className="btn--lg"
                disabled={!canBulkAction}
                onClick={() => handleBulkAction(selectedRowKeys)}
              >
                {translate("general.actions.delete")}
              </Button>
            </ActionBarComponent>
            <StandardTable
              rowKey={nameof(list[0].id)}
              columns={columns}
              dataSource={list}
              isDragable={true}
              tableSize={"md"}
              onChange={handleTableChange}
              loading={loadingList}
              scroll={{ x: 1000 }}
            />

            <Pagination
              skip={filter?.skip}
              take={filter?.take}
              total={count}
              onChange={handlePagination}
              canChangePageSize={false}
            />
          </div>
        </div>
      </div>
      {visible && (
        <WorkflowParameterAdvanceFilter
          visible={visible}
          handleClose={handleCancel}
          visibleFooter={true}
          loading={false}
          size={"sm"}
          filter={filter}
          setVisible={setVisible}
          handleChangeAllFilter={handleChangeAllFilter}
        />
      )}
    </>
  );
}
export default WorkflowParameterMaster;
