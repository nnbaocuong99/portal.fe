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
import {
  WORKFLOW_DIRECTION_PREVIEW_ROUTE,
  WORKFLOW_DIRECTION_ROUTE,
} from "config/route-consts";
import { Status, StatusFilter } from "models/Status";
import {
  WorkflowDefinition,
  WorkflowDefinitionFilter,
} from "models/WorkflowDefinition";
import {
  WorkflowDirection,
  WorkflowDirectionFilter,
} from "models/WorkflowDirection";
import { WorkflowStep, WorkflowStepFilter } from "models/WorkflowStep";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
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
import { workflowDirectionRepository } from "repositories/workflow-direction-repository";
import { filterService } from "services/filter-service";
import { listService } from "services/list-service";
import { masterService } from "services/master-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import WorkflowDirectionAdvanceFilter from "./WorkflowDirectionAdvanceFilter";
/* end individual import */

function WorkflowDirectionMaster() {
  const [translate] = useTranslation();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    WorkflowDirectionFilter,
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
    workflowDirectionRepository.list,
    workflowDirectionRepository.count,
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
    selectedRowKeys,
    setSelectedRowKeys,
  } = listService.useRowSelection(
    workflowDirectionRepository.delete,
    workflowDirectionRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
  );

  const { handleDeleteItem, handleGoDetail, handleGoCreate } =
    masterService.useMasterAction(WORKFLOW_DIRECTION_ROUTE, handleAction);

  const history = useHistory();

  const handleGoPreview = React.useCallback(
    (id: number) => {
      return () => {
        history.push(`${WORKFLOW_DIRECTION_PREVIEW_ROUTE}?id=${id}`);
      };
    },
    [history]
  );
  const ref = React.useRef<boolean>(true);

  React.useEffect(() => {
    if (ref.current) {
      if (
        filter["workflowDefinitionId"]["equal"] &&
        !filter["workflowDefinitionValue"]
      ) {
        workflowDirectionRepository
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

  const menuAction = React.useCallback(
    (id: number, workflowDirection: WorkflowDirection) => (
      <Menu>
        <Menu.Item key="1">
          <div className="ant-action-menu" onClick={handleGoPreview(id)}>
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
            onClick={handleDeleteItem(workflowDirection)}
          >
            {translate("general.actions.delete")}
          </div>
        </Menu.Item>
      </Menu>
    ),
    [translate, handleGoPreview, handleGoDetail, handleDeleteItem]
  );

  const columns: ColumnProps<WorkflowDirection>[] = useMemo(
    () => [
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDirections.workflowDefinition")}
          />
        ),
        key: nameof(list[0].workflowDefinition),
        dataIndex: nameof(list[0].workflowDefinition),
        sorter: true,
        sortOrder: getAntOrderType<WorkflowDirection, WorkflowDirectionFilter>(
          filter,
          nameof(list[0].workflowDefinition)
        ),
        width: 150,
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
            title={translate("workflowDirections.fromStep")}
          />
        ),
        key: nameof(list[0].fromStep),
        dataIndex: nameof(list[0].fromStep),
        sorter: true,
        sortOrder: getAntOrderType<WorkflowDirection, WorkflowDirectionFilter>(
          filter,
          nameof(list[0].fromStep)
        ),
        width: 150,
        ellipsis: true,
        render(fromStep: WorkflowStep) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={fromStep.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDirections.toStep")}
          />
        ),
        key: nameof(list[0].toStep),
        dataIndex: nameof(list[0].toStep),
        sorter: true,
        sortOrder: getAntOrderType<WorkflowDirection, WorkflowDirectionFilter>(
          filter,
          nameof(list[0].toStep)
        ),
        width: 150,
        ellipsis: true,
        render(toStep: WorkflowStep) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={toStep.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDirections.status")}
          />
        ),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        sortOrder: getAntOrderType<WorkflowDirection, WorkflowDirectionFilter>(
          filter,
          nameof(list[0].status)
        ),
        width: 120,
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
        render(id: number, workflowDirection: WorkflowDirection) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, workflowDirection)}
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
          title={translate("workflowDirections.master.subHeader")}
          breadcrumbItems={[
            translate("workflowDirections.master.header"),
            translate("workflowDirections.master.subHeader"),
          ]}
        />
        <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--xs p-b--xs">
            {translate("workflowDirections.master.title")}
          </div>
          <div className="page-master__content">
            <div className="page-master__tag-filter">
              <TagFilter
                value={filter}
                translate={translate}
                keyTranslate={"workflowDirections"}
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
                        "workflowDirections.placeholder.workflowDefinition"
                      )}
                      classFilter={WorkflowDefinitionFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].workflowDefinition),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={
                        workflowDirectionRepository.filterListWorkflowDefinition
                      }
                      title={translate("workflowDirections.workflowDefinition")}
                    />
                  </div>
                  <div className="">
                    <AdvanceIdFilterMaster
                      value={filter[nameof(list[0].fromStepId)]["equal"]}
                      placeHolder={translate(
                        "workflowDirections.placeholder.fromStep"
                      )}
                      classFilter={WorkflowStepFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].fromStep),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={
                        workflowDirectionRepository.filterListWorkflowStep
                      }
                      valueFilter={{
                        ...new WorkflowStepFilter(),
                        workflowDefinitionId: {
                          equal:
                            filter[nameof(list[0].workflowDefinitionId)][
                              "equal"
                            ],
                        },
                      }}
                      title={translate("workflowDirections.fromStep")}
                    />
                  </div>
                  <div className="">
                    <AdvanceIdFilterMaster
                      value={filter[nameof(list[0].toStepId)]["equal"]}
                      placeHolder={translate(
                        "workflowDirections.placeholder.toStep"
                      )}
                      classFilter={WorkflowStepFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].toStep),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={
                        workflowDirectionRepository.filterListWorkflowStep
                      }
                      valueFilter={{
                        ...new WorkflowStepFilter(),
                        workflowDefinitionId: {
                          equal:
                            filter[nameof(list[0].workflowDefinitionId)][
                              "equal"
                            ],
                        },
                      }}
                      title={translate("workflowDirections.toStep")}
                    />
                  </div>
                  <div>
                    <AdvanceIdFilterMaster
                      value={filter[nameof(list[0].statusId)]["equal"]}
                      placeHolder={translate(
                        "workflowDirections.placeholder.status"
                      )}
                      classFilter={StatusFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].status),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={workflowDirectionRepository.filterListStatus}
                      title={translate("workflowDirections.status")}
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
                      classFilter={WorkflowDirectionFilter}
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
        <WorkflowDirectionAdvanceFilter
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
export default WorkflowDirectionMaster;
