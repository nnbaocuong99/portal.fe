/* begin general import */
import {
  Add16,
  DocumentPdf16,
  Download16,
  OverflowMenuHorizontal16,
  SettingsAdjust16,
  TrashCan16,
  Upload16,
} from "@carbon/icons-react";
import { Dropdown, Menu, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { WORKFLOW_DIRECTION_CONDITION_ROUTE } from "config/route-consts";
import {
  WorkflowDirection,
  WorkflowDirectionFilter,
} from "models/WorkflowDirection";
import {
  WorkflowDirectionCondition,
  WorkflowDirectionConditionFilter,
} from "models/WorkflowDirectionCondition";
import {
  WorkflowOperator,
  WorkflowOperatorFilter,
} from "models/WorkflowOperator";
import {
  WorkflowParameter,
  WorkflowParameterFilter,
} from "models/WorkflowParameter";
import React, { useMemo, useRef } from "react";
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
import { workflowDirectionConditionRepository } from "repositories/workflow-direction-condition-repository";
import { detailService } from "services/detail-service";
import { filterService } from "services/filter-service";
import { importExportService } from "services/import-export-service";
import { listService } from "services/list-service";
import { masterService } from "services/master-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import WorkflowDirectionConditionDetailDrawer from "../WorkflowDirectionConditionDetail/WorkflowDirectionConditionDetailDrawer";
import WorkflowDirectionConditionAdvanceFilter from "./WorkflowDirectionConditionAdvanceFilter";
/* end individual import */

function WorkflowDirectionConditionMaster() {
  const [translate] = useTranslation();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    WorkflowDirectionConditionFilter,
    { skip: 0, take: 10 }
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  const importButtonRef: React.LegacyRef<HTMLInputElement> =
    useRef<HTMLInputElement>();

  const { handleImportList } = importExportService.useImport();

  const { handleListExport, handleExportTemplateList, loading } =
    importExportService.useExport();

  const {
    value: filter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    handleChangeInputSearch,
  } = filterService.useFilter(modelFilter, dispatch);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList(
      workflowDirectionConditionRepository.list,
      workflowDirectionConditionRepository.count,
      filter,
      handleChangeAllFilter
    );

  const { handleTableChange, handlePagination } = tableService.useTable(
    filter,
    handleChangeAllFilter
  );

  const {
    handleAction,
    handleBulkAction,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
  } = listService.useRowSelection(
    workflowDirectionConditionRepository.delete,
    workflowDirectionConditionRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
  );

  const { handleDeleteItem } = masterService.useMasterAction(
    WORKFLOW_DIRECTION_CONDITION_ROUTE,
    handleAction
  );

  const {
    model,
    dispatch: dispatchModal,
    isOpenDetailModal,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleSaveModel,
    loadingModel,
    handleChangeSingleField,
    handleChangeSelectField,
  } = detailService.useDetailModal(
    WorkflowDirectionCondition,
    workflowDirectionConditionRepository.get,
    workflowDirectionConditionRepository.save,
    handleLoadList
  );

  const menuAction = React.useCallback(
    (id: number, workflowDirectionCondition: WorkflowDirectionCondition) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu"
            onClick={() => handleOpenDetailModal(id)}
          >
            {translate("general.actions.view")}
          </div>
        </Menu.Item>
        <Menu.Item key="2">
          <div
            className="ant-action-menu"
            onClick={() => handleOpenDetailModal(id)}
          >
            {translate("general.actions.edit")}
          </div>
        </Menu.Item>
        <Menu.Item key="3">
          <div
            className="ant-action-menu"
            onClick={handleDeleteItem(workflowDirectionCondition)}
          >
            {translate("general.actions.delete")}
          </div>
        </Menu.Item>
      </Menu>
    ),
    [handleOpenDetailModal, handleDeleteItem, translate]
  );

  const columns: ColumnProps<WorkflowDirectionCondition>[] = useMemo(
    () => [
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDirectionConditions.value")}
          />
        ),
        key: nameof(list[0].value),
        dataIndex: nameof(list[0].value),
        sorter: true,
        sortOrder: getAntOrderType<
          WorkflowDirectionCondition,
          WorkflowDirectionConditionFilter
        >(filter, nameof(list[0].value)),
        ellipsis: true,
        render(...params: [string, WorkflowDirectionCondition, number]) {
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
            title={translate("workflowDirectionConditions.workflowDirection")}
          />
        ),
        key: nameof(list[0].workflowDirection),
        dataIndex: nameof(list[0].workflowDirection),
        sorter: true,
        sortOrder: getAntOrderType<
          WorkflowDirectionCondition,
          WorkflowDirectionConditionFilter
        >(filter, nameof(list[0].workflowDirection)),
        ellipsis: true,
        render(workflowDirection: WorkflowDirection) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={workflowDirection.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDirectionConditions.workflowOperator")}
          />
        ),
        key: nameof(list[0].workflowOperator),
        dataIndex: nameof(list[0].workflowOperator),
        sorter: true,
        sortOrder: getAntOrderType<
          WorkflowDirectionCondition,
          WorkflowDirectionConditionFilter
        >(filter, nameof(list[0].workflowOperator)),
        ellipsis: true,
        render(workflowOperator: WorkflowOperator) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={workflowOperator.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDirectionConditions.workflowParameter")}
          />
        ),
        key: nameof(list[0].workflowParameter),
        dataIndex: nameof(list[0].workflowParameter),
        sorter: true,
        sortOrder: getAntOrderType<
          WorkflowDirectionCondition,
          WorkflowDirectionConditionFilter
        >(filter, nameof(list[0].workflowParameter)),
        ellipsis: true,
        render(workflowParameter: WorkflowParameter) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={workflowParameter.name} />
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
        dataIndex: nameof(list[0].id),
        fixed: "right",
        width: 80,
        align: "center",
        render(
          id: number,
          workflowDirectionCondition: WorkflowDirectionCondition
        ) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, workflowDirectionCondition)}
                trigger={["click"]}
                placement="bottom"
                arrow
              >
                <OverflowMenuHorizontal16 />
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [translate, list, filter, menuAction]
  );

  const handleCancel = React.useCallback(() => {
    setVisible(false);
  }, []);
  return (
    <>
      <Spin spinning={loading}>
        <div className="page-content">
          <PageHeader
            title={translate("workflowDirectionConditions.master.subHeader")}
            breadcrumbItems={[
              translate("workflowDirectionConditions.master.header"),
              translate("workflowDirectionConditions.master.subHeader"),
            ]}
          />
          <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
            <div className="page-master__title p-l--sm p-t--xs p-b--xs">
              {translate("workflowDirectionConditions.master.title")}
            </div>
            <div className="page-master__content">
              <div className="page-master__tag-filter">
                <TagFilter
                  value={filter}
                  translate={translate}
                  keyTranslate={" workflowDirectionConditions "}
                  handleChangeFilter={handleChangeAllFilter}
                  onClear={(value: any) => {
                    return 0;
                  }}
                />
              </div>
              {(!selectedRowKeys || selectedRowKeys?.length === 0) && (
                <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
                  <div className="page-master__filter d-flex align-items-center justify-content-start">
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="">
                        <AdvanceIdFilterMaster
                          value={
                            filter[nameof(list[0].workflowDirectionId)]["equal"]
                          }
                          placeHolder={translate(
                            "workflowDirectionConditions.placeholder.workflowDirection"
                          )}
                          classFilter={WorkflowDirectionFilter}
                          onChange={handleChangeSelectFilter({
                            fieldName: nameof(list[0].workflowDirection),
                            fieldType: "equal",
                            classFilter: IdFilter,
                          })}
                          getList={
                            workflowDirectionConditionRepository.filterListWorkflowDirection
                          }
                          title={translate(
                            "workflowDirectionConditions.workflowDirection"
                          )}
                        />
                      </div>
                      <div className="">
                        <AdvanceIdFilterMaster
                          value={
                            filter[nameof(list[0].workflowOperatorId)]["equal"]
                          }
                          placeHolder={translate(
                            "workflowDirectionConditions.placeholder.workflowOperator"
                          )}
                          classFilter={WorkflowOperatorFilter}
                          onChange={handleChangeSelectFilter({
                            fieldName: nameof(list[0].workflowOperator),
                            fieldType: "equal",
                            classFilter: IdFilter,
                          })}
                          getList={
                            workflowDirectionConditionRepository.filterListWorkflowOperator
                          }
                          title={translate(
                            "workflowDirectionConditions.workflowOperator"
                          )}
                        />
                      </div>
                      <div className="">
                        <AdvanceIdFilterMaster
                          value={
                            filter[nameof(list[0].workflowParameterId)]["equal"]
                          }
                          placeHolder={translate(
                            "workflowDirectionConditions.placeholder.workflowParameter"
                          )}
                          classFilter={WorkflowParameterFilter}
                          onChange={handleChangeSelectFilter({
                            fieldName: nameof(list[0].workflowParameter),
                            fieldType: "equal",
                            classFilter: IdFilter,
                          })}
                          getList={
                            workflowDirectionConditionRepository.filterListWorkflowParameter
                          }
                          title={translate(
                            "workflowDirectionConditions.workflowParameter"
                          )}
                        />
                      </div>
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
                      classFilter={WorkflowDirectionConditionFilter}
                      placeHolder={translate("general.placeholder.search")}
                      onChange={handleChangeInputSearch}
                    />
                  </div>
                  <div className="page-master__actions  d-flex align-items-center justify-content-start">
                    <div className="page-master__filter-action d-flex align-items-center">
                      <input
                        ref={importButtonRef}
                        type="file"
                        style={{ display: "none" }}
                        id="master-import"
                        onChange={handleImportList(
                          workflowDirectionConditionRepository.import
                        )}
                        onClick={() => {
                          importButtonRef.current.value = null;
                        }}
                      />
                      <Button
                        type="icon-only-ghost"
                        icon={<Download16 />}
                        onClick={handleListExport(
                          filter,
                          workflowDirectionConditionRepository.export
                        )}
                        className="btn--xl"
                      />
                      <Button
                        type="icon-only-ghost"
                        icon={<Upload16 />}
                        onClick={() => {
                          importButtonRef.current.click();
                        }}
                        className="btn--xl"
                      />
                      <Button
                        type="icon-only-ghost"
                        icon={<DocumentPdf16 />}
                        onClick={handleExportTemplateList(
                          workflowDirectionConditionRepository.exportTemplate
                        )}
                        className="btn--xl"
                      />
                      <Button
                        type="primary"
                        className="btn--lg"
                        icon={<Add16 />}
                        onClick={() => handleOpenDetailModal(null)}
                      >
                        {translate("general.actions.create")}
                      </Button>
                    </div>
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
                rowSelection={rowSelection}
                scroll={{ x: 1500 }}
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
      </Spin>
      {visible && (
        <WorkflowDirectionConditionAdvanceFilter
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
      <WorkflowDirectionConditionDetailDrawer
        model={model}
        visible={isOpenDetailModal}
        handleSave={handleSaveModel}
        handleCancel={handleCloseDetailModal}
        handleChangeSingleField={handleChangeSingleField}
        handleChangeSelectField={handleChangeSelectField}
        dispatch={dispatchModal}
        loading={loadingModel}
        visibleFooter={true}
      />
    </>
  );
}
export default WorkflowDirectionConditionMaster;
