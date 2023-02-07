/* begin general import */
import {
  Add16,
  OverflowMenuHorizontal16,
  SettingsAdjust16,
} from "@carbon/icons-react";
import { Dropdown, Menu, notification } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import {
  WORKFLOW_DEFINITION_PREVIEW_ROUTE,
  WORKFLOW_DEFINITION_ROUTE,
  WORKFLOW_DIRECTION_MASTER_ROUTE,
  WORKFLOW_STEP_MASTER_ROUTE,
} from "config/route-consts";
import { formatDate } from "helpers/date-time";
import { Organization, OrganizationFilter } from "models/Organization";
import { Status, StatusFilter } from "models/Status";
import {
  WorkflowDefinition,
  WorkflowDefinitionFilter,
} from "models/WorkflowDefinition";
import { WorkflowType, WorkflowTypeFilter } from "models/WorkflowType";
import { Moment } from "moment";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { IdFilter } from "react3l-advanced-filters";
import {
  AdvanceIdFilterMaster,
  AdvanceTreeFilterMaster,
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
import InputSearch from "react3l-ui-library/build/components/Input/InputSearch";
/* end filter import */
/* begin individual import */
import { workflowDefinitionRepository } from "repositories/workflow-definition-repository";
import { filterService } from "services/filter-service";
import { listService } from "services/list-service";
import { masterService } from "services/master-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import WorkflowDefinitionAdvanceFilter from "./WorkflowDefinitionAdvanceFilter";
/* end individual import */

function WorkflowDefinitionMaster() {
  const [translate] = useTranslation();
  const history = useHistory();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    WorkflowDefinitionFilter,
    { skip: 0, take: 10 }
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  const {
    value: filter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    handleChangeSingleTreeFilter,
    handleChangeInputSearch,
  } = filterService.useFilter(modelFilter, dispatch);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList(
      workflowDefinitionRepository.list,
      workflowDefinitionRepository.count,
      filter,
      handleChangeAllFilter
    );

  const { handleTableChange, handlePagination } = tableService.useTable(
    filter,
    handleChangeAllFilter
  );

  const { handleAction, selectedRowKeys } = listService.useRowSelection(
    workflowDefinitionRepository.delete,
    workflowDefinitionRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
  );

  const { handleGoCreate, handleGoDetail, handleDeleteItem } =
    masterService.useMasterAction(WORKFLOW_DEFINITION_ROUTE, handleAction);
  const handleClone = React.useCallback(
    (id: number) => {
      workflowDefinitionRepository.clone(id).subscribe(
        () => {
          handleLoadList();
          notification.success({
            placement: "bottomRight",
            message: translate(
              "workflowDefinitions.notifications.cloneSuccess"
            ),
          });
        },
        (error) => {
          notification.error({
            placement: "bottomRight",
            message: translate("workflowDefinitions.notifications.cloneError"),
          });
        }
      );
    },
    [handleLoadList, translate]
  );
  const handleOpenViewWorkflowStep = React.useCallback(
    (id: number) => {
      history.push(
        `${WORKFLOW_STEP_MASTER_ROUTE}?skip=0&take=10&workflowDefinitionId%5Bequal%5D=${id}`
      );
    },
    [history]
  );
  const handleOpenViewWorkflowDirection = React.useCallback(
    (id: number) => {
      history.push(
        `${WORKFLOW_DIRECTION_MASTER_ROUTE}?skip=0&take=10&workflowDefinitionId%5Bequal%5D=${id}`
      );
    },
    [history]
  );
  const handleGoPreview = React.useCallback(
    (id: number) => {
      return () => {
        history.push(`${WORKFLOW_DEFINITION_PREVIEW_ROUTE}?id=${id}`);
      };
    },
    [history]
  );
  const menuAction = React.useCallback(
    (id: number, workflowDefinition: WorkflowDefinition) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu text-center"
            onClick={() => handleClone(id)}
          >
            {translate("workflowDefinitions.actions.clone")}
          </div>
        </Menu.Item>
        <Menu.Item key="2">
          <div
            className="ant-action-menu text-center"
            onClick={() => handleOpenViewWorkflowStep(id)}
          >
            {translate("workflowDefinitions.actions.viewWorkflowStep")}
          </div>
        </Menu.Item>
        <Menu.Item key="3">
          <div
            className="ant-action-menu text-center"
            onClick={() => handleOpenViewWorkflowDirection(id)}
          >
            {translate("workflowDefinitions.actions.viewWorkflowDirection")}
          </div>
        </Menu.Item>
        <Menu.Item key="4">
          <div
            className="ant-action-menu text-center"
            onClick={handleGoPreview(id)}
          >
            {translate("general.actions.view")}
          </div>
        </Menu.Item>
        <Menu.Item key="5">
          <div
            className="ant-action-menu text-center"
            onClick={handleGoDetail(id)}
          >
            {translate("general.actions.edit")}
          </div>
        </Menu.Item>
        <Menu.Item key="6">
          <div
            className="ant-action-menu text-center"
            onClick={handleDeleteItem(workflowDefinition)}
          >
            {translate("general.actions.delete")}
          </div>
        </Menu.Item>
      </Menu>
    ),
    [
      translate,
      handleGoPreview,
      handleGoDetail,
      handleDeleteItem,
      handleClone,
      handleOpenViewWorkflowStep,
      handleOpenViewWorkflowDirection,
    ]
  );

  const columns: ColumnProps<WorkflowDefinition>[] = useMemo(
    () => [
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDefinitions.code")}
          />
        ),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        width: 120,
        sorter: true,
        sortOrder: getAntOrderType<
          WorkflowDefinition,
          WorkflowDefinitionFilter
        >(filter, nameof(list[0].code)),
        ellipsis: true,
        render(...params: [string, WorkflowDefinition, number]) {
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
            title={translate("workflowDefinitions.name")}
          />
        ),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        width: 120,
        sortOrder: getAntOrderType<
          WorkflowDefinition,
          WorkflowDefinitionFilter
        >(filter, nameof(list[0].name)),
        ellipsis: true,
        render(...params: [string, WorkflowDefinition, number]) {
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
            title={translate("workflowDefinitions.workflowType")}
          />
        ),
        key: nameof(list[0].workflowType),
        dataIndex: nameof(list[0].workflowType),
        sorter: true,
        width: 120,
        sortOrder: getAntOrderType<
          WorkflowDefinition,
          WorkflowDefinitionFilter
        >(filter, nameof(list[0].workflowType)),
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
            title={translate("workflowDefinitions.organization")}
          />
        ),
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        sorter: true,
        width: 120,
        sortOrder: getAntOrderType<
          WorkflowDefinition,
          WorkflowDefinitionFilter
        >(filter, nameof(list[0].organization)),
        ellipsis: true,
        render(organization: Organization) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={organization.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDefinitions.date")}
          />
        ),
        key: nameof(list[0].startDate),
        dataIndex: nameof(list[0].startDate),
        sorter: true,
        width: 150,
        sortOrder: getAntOrderType<
          WorkflowDefinition,
          WorkflowDefinitionFilter
        >(filter, nameof(list[0].startDate)),
        ellipsis: true,
        render(...params: [Moment, WorkflowDefinition, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                value={`${params[0] ? formatDate(params[0]) : ""} - ${
                  params[1]?.endDate ? formatDate(params[1]?.endDate) : ""
                }`}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDefinitions.createdAt")}
          />
        ),
        key: nameof(list[0].createdAt),
        dataIndex: nameof(list[0].createdAt),
        sorter: true,
        width: 100,
        sortOrder: getAntOrderType<
          WorkflowDefinition,
          WorkflowDefinitionFilter
        >(filter, nameof(list[0].createdAt)),
        ellipsis: true,
        render(...params: [Moment, WorkflowDefinition, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={formatDate(params[0])} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("workflowDefinitions.status")}
          />
        ),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        width: 120,
        sortOrder: getAntOrderType<
          WorkflowDefinition,
          WorkflowDefinitionFilter
        >(filter, nameof(list[0].status)),
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
        render(id: number, workflowDefinition: WorkflowDefinition) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, workflowDefinition)}
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
          title={translate("workflowDefinitions.master.subHeader")}
          breadcrumbItems={[
            translate("workflowDefinitions.master.header"),
            translate("workflowDefinitions.master.subHeader"),
          ]}
        />
        <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--xs p-b--xs">
            {translate("workflowDefinitions.master.title")}
          </div>
          <div className="page-master__content">
            <div className="page-master__tag-filter">
              <TagFilter
                value={filter}
                translate={translate}
                keyTranslate={"workflowDefinitions"}
                handleChangeFilter={handleChangeAllFilter}
                onClear={(value: any) => {
                  return 0;
                }}
              />
            </div>
            {(!selectedRowKeys || selectedRowKeys?.length === 0) && (
              <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
                <div className="page-master__filter d-flex align-items-center justify-content-start">
                  <div>
                    <AdvanceIdFilterMaster
                      value={filter[nameof(list[0].workflowTypeId)]["equal"]}
                      placeHolder={translate(
                        "workflowDefinitions.placeholder.workflowType"
                      )}
                      classFilter={WorkflowTypeFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].workflowType),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={
                        workflowDefinitionRepository.filterListWorkflowType
                      }
                      title={translate("workflowDefinitions.workflowType")}
                    />
                  </div>

                  <div>
                    <AdvanceIdFilterMaster
                      value={filter[nameof(list[0].statusId)]["equal"]}
                      placeHolder={translate(
                        "workflowDefinitions.placeholder.status"
                      )}
                      classFilter={StatusFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].status),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={workflowDefinitionRepository.filterListStatus}
                      title={translate("workflowDefinitions.status")}
                    />
                  </div>

                  <div>
                    <AdvanceTreeFilterMaster
                      onChange={handleChangeSingleTreeFilter({
                        fieldName: "organization",
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      title={translate("workflowDefinitions.organization")}
                      placeHolder={translate(
                        "workflowDefinitions.placeholder.organization"
                      )}
                      getTreeData={
                        workflowDefinitionRepository.filterListOrganization
                      }
                      checkStrictly={true}
                      classFilter={OrganizationFilter}
                      item={filter[nameof(list[0].organizationValue)]}
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
                    classFilter={WorkflowDefinitionFilter}
                    placeHolder={translate("general.placeholder.search")}
                    onChange={handleChangeInputSearch}
                  />
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
        <WorkflowDefinitionAdvanceFilter
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
export default WorkflowDefinitionMaster;
