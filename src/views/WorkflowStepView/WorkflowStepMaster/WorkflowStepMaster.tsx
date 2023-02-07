/* begin general import */
import {
  Add16,
  OverflowMenuHorizontal16,
  SettingsAdjust16,
  TrashCan16,
} from "@carbon/icons-react";
import { Dropdown, Menu } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { WORKFLOW_STEP_ROUTE } from "config/route-consts";
import { Role, RoleFilter } from "models/Role";
import { Status, StatusFilter } from "models/Status";
import {
  WorkflowDefinition,
  WorkflowDefinitionFilter,
} from "models/WorkflowDefinition";
import { WorkflowStep, WorkflowStepFilter } from "models/WorkflowStep";
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
import { workflowStepRepository } from "repositories/workflow-step-repository";
import { detailService } from "services/detail-service";
import { filterService } from "services/filter-service";
import { importExportService } from "services/import-export-service";
import { listService } from "services/list-service";
import { masterService } from "services/master-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import WorkflowStepAdvanceFilter from "./WorkflowStepAdvanceFilter";
import WorkflowStepPreviewDrawer from "./WorkflowStepPreviewDrawer";
/* end individual import */

function WorkflowStepMaster() {
  const [translate] = useTranslation();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    WorkflowStepFilter,
    { skip: 0, take: 10 }
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  importExportService.useExport();
  const ref = React.useRef<boolean>(true);

  const {
    value: filter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    handleChangeInputSearch,
  } = filterService.useFilter(modelFilter, dispatch);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList(
      workflowStepRepository.list,
      workflowStepRepository.count,
      filter,
      handleChangeAllFilter
    );

  React.useEffect(() => {
    if (ref.current) {
      if (
        filter["workflowDefinitionId"]["equal"] &&
        !filter["workflowDefinitionValue"]
      ) {
        workflowStepRepository
          .filterListWorkflowDefinition({
            ...new WorkflowDefinitionFilter(),
            id: { equal: filter["workflowDefinitionId"]["equal"] },
          })
          .subscribe((res) => {
            handleChangeAllFilter({
              ...filter,
              workflowDefinitionValue: res[0],
            });
          });
      }
      ref.current = false;
    }
  }, [filter, handleChangeAllFilter]);

  const { handleTableChange, handlePagination } = tableService.useTable(
    filter,
    handleChangeAllFilter
  );

  const {
    handleAction,
    handleBulkAction,
    canBulkAction,
    selectedRowKeys,
    setSelectedRowKeys,
  } = listService.useRowSelection(
    workflowStepRepository.delete,
    workflowStepRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
  );
  const {
    model,
    isOpenDetailModal,
    handleOpenDetailModal: handleOpenPreviewModal,
    handleCloseDetailModal,
    loadingModel,
  } = detailService.useDetailModal(
    WorkflowStep,
    workflowStepRepository.get,
    workflowStepRepository.save,
    handleLoadList
  );
  const { handleDeleteItem, handleGoDetail, handleGoCreate } =
    masterService.useMasterAction(WORKFLOW_STEP_ROUTE, handleAction);

  const menuAction = React.useCallback(
    (id: number, workflowStep: WorkflowStep) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu"
            onClick={() => handleOpenPreviewModal(id)}
          >
            {translate("general.actions.view")}
          </div>
        </Menu.Item>
        <Menu.Item key="2">
          <div className="ant-action-menu" onClick={handleGoDetail(id)}>
            {translate("general.actions.edit")}
          </div>
        </Menu.Item>
        <Menu.Item key="3">
          <div
            className="ant-action-menu"
            onClick={handleDeleteItem(workflowStep)}
          >
            {translate("general.actions.delete")}
          </div>
        </Menu.Item>
      </Menu>
    ),
    [translate, handleGoDetail, handleDeleteItem, handleOpenPreviewModal]
  );

  const columns: ColumnProps<WorkflowStep>[] = useMemo(
    () => [
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowSteps.workflowDefinition")}
          />
        ),
        width: 100,
        key: nameof(list[0].workflowDefinition),
        dataIndex: nameof(list[0].workflowDefinition),
        sorter: true,
        sortOrder: getAntOrderType<WorkflowStep, WorkflowStepFilter>(
          filter,
          nameof(list[0].workflowDefinition)
        ),
        ellipsis: true,
        render(workflowDefinition: WorkflowDefinition) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={workflowDefinition.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowSteps.code")}
          />
        ),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getAntOrderType<WorkflowStep, WorkflowStepFilter>(
          filter,
          nameof(list[0].code)
        ),
        width: 100,
        ellipsis: true,
        render(...params: [string, WorkflowStep, number]) {
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
            title={translate("workflowSteps.name")}
          />
        ),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        width: 180,
        sortOrder: getAntOrderType<WorkflowStep, WorkflowStepFilter>(
          filter,
          nameof(list[0].name)
        ),
        ellipsis: true,
        render(...params: [string, WorkflowStep, number]) {
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
            title={translate("workflowSteps.role")}
          />
        ),
        key: nameof(list[0].role),
        dataIndex: nameof(list[0].role),
        sorter: true,
        width: 100,
        sortOrder: getAntOrderType<WorkflowStep, WorkflowStepFilter>(
          filter,
          nameof(list[0].role)
        ),
        ellipsis: true,
        render(role: Role) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={role.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowSteps.status")}
          />
        ),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        width: 120,
        sortOrder: getAntOrderType<WorkflowStep, WorkflowStepFilter>(
          filter,
          nameof(list[0].status)
        ),
        ellipsis: true,
        render(status: Status) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <div
                className={
                  status?.id === 1
                    ? "status__icon-active m-r--sm"
                    : "status__icon-inactive m-r--sm"
                }
              />
              <OneLineText value={status.name} />
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
        render(id: number, workflowStep: WorkflowStep) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, workflowStep)}
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
      <div className="page-content">
        <PageHeader
          title={translate("workflowSteps.master.subHeader")}
          breadcrumbItems={[
            translate("workflowSteps.master.header"),
            translate("workflowSteps.master.subHeader"),
          ]}
        />
        <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--xs p-b--xs">
            {translate("workflowSteps.master.title")}
          </div>
          <div className="page-master__content">
            <div className="page-master__tag-filter">
              <TagFilter
                value={filter}
                translate={translate}
                keyTranslate={"workflowSteps"}
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
                        filter[nameof(list[0].workflowDefinitionId)]["equal"]
                      }
                      placeHolder={translate(
                        "workflowSteps.placeholder.workflowDefinition"
                      )}
                      classFilter={WorkflowDefinitionFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].workflowDefinition),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={
                        workflowStepRepository.filterListWorkflowDefinition
                      }
                      title={translate("workflowSteps.workflowDefinition")}
                    />
                  </div>

                  <div className="">
                    <AdvanceIdFilterMaster
                      value={filter[nameof(list[0].roleId)]["equal"]}
                      placeHolder={translate("workflowSteps.placeholder.role")}
                      classFilter={RoleFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].role),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={workflowStepRepository.filterListRole}
                      title={translate("workflowSteps.role")}
                    />
                  </div>
                  <div className="">
                    <AdvanceIdFilterMaster
                      value={filter[nameof(list[0].statusId)]["equal"]}
                      placeHolder={translate(
                        "workflowSteps.placeholder.status"
                      )}
                      classFilter={StatusFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].status),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={workflowStepRepository.filterListStatus}
                      title={translate("workflowSteps.status")}
                    />
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
                      classFilter={WorkflowStepFilter}
                      placeHolder={translate("general.placeholder.search")}
                      onChange={handleChangeInputSearch}
                    />
                  </div>
                </div>

                <div className="page-master__actions  d-flex align-items-center justify-content-start">
                  <div className="page-master__filter-action d-flex align-items-center">
                    <Button
                      type="primary"
                      className="btn--lg"
                      icon={<Add16 />}
                      onClick={handleGoCreate}
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
        <WorkflowStepAdvanceFilter
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
      <WorkflowStepPreviewDrawer
        model={model}
        visible={isOpenDetailModal}
        handleCancel={handleCloseDetailModal}
        loading={loadingModel}
        visibleFooter={true}
      />
    </>
  );
}
export default WorkflowStepMaster;
