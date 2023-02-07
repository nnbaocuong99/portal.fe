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
import { ROLE_DETAIL_ROUTE, ROLE_ROUTE } from "config/route-consts";
import { Role, RoleFilter } from "models/Role";
import { Site } from "models/Site";
import { Status, StatusFilter } from "models/Status";
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
import { roleRepository } from "repositories/role-repository";
import { filterService } from "services/filter-service";
import { listService } from "services/list-service";
import { masterService } from "services/master-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import RoleAdvanceFilter from "./RoleAdvanceFilter";

/* end individual import */

function RoleMaster() {
  const [translate] = useTranslation();

  const history = useHistory();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    RoleFilter,
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
    roleRepository.list,
    roleRepository.count,
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
    roleRepository.delete,
    roleRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
  );

  const { handleGoCreate, handleGoDetail, handleDeleteItem } =
    masterService.useMasterAction(ROLE_ROUTE, handleAction);

  const handleClone = React.useCallback(
    (id) => {
      roleRepository.clone(id).subscribe((item: Role) => {
        handleChangeAllFilter(filter);
      });
    },
    [filter, handleChangeAllFilter]
  );

  const handleGoAssignAppuser = React.useCallback(
    (id) => {
      history.push(`${ROLE_DETAIL_ROUTE}/assign-app-user?id=${id}`);
    },
    [history]
  );

  const handleCancel = React.useCallback(() => {
    setVisible(false);
  }, []);

  const menuAction = React.useCallback(
    (id: number, role: Role) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu text-center"
            onClick={() => handleClone(id)}
          >
            {translate("roles.actions.clone")}
          </div>
        </Menu.Item>

        <Menu.Item key="2">
          <div
            className="ant-action-menu text-center"
            onClick={() => handleGoAssignAppuser(id)}
          >
            {translate("roles.actions.assignAppUser")}
          </div>
        </Menu.Item>

        <Menu.Item key="3">
          <div
            className="ant-action-menu text-center"
            onClick={handleGoDetail(id)}
          >
            {translate("general.actions.edit")}
          </div>
        </Menu.Item>

        {!role.used && (
          <Menu.Item key="5">
            <div
              className="ant-action-menu text-center"
              onClick={handleDeleteItem(role)}
            >
              {translate("general.actions.delete")}
            </div>
          </Menu.Item>
        )}
      </Menu>
    ),
    [
      handleClone,
      handleDeleteItem,
      handleGoAssignAppuser,
      handleGoDetail,
      translate,
    ]
  );
  const columns: ColumnProps<Role>[] = useMemo(
    () => [
      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "code"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("roles.code")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getAntOrderType<Role, RoleFilter>(
          filter,
          nameof(list[0].code)
        ),
        render(...params: [string, Role, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "name"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("roles.name")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getAntOrderType<Role, RoleFilter>(
          filter,
          nameof(list[0].name)
        ),
        render(...params: [string, Role, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "site"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("roles.site")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].site),
        dataIndex: nameof(list[0].site),
        sorter: true,
        sortOrder: getAntOrderType<Role, RoleFilter>(
          filter,
          nameof(list[0].site)
        ),
        render(site: Site) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={site.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "status"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("roles.status")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        sortOrder: getAntOrderType<Role, RoleFilter>(
          filter,
          nameof(list[0].status)
        ),
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
        render(id: number, role: Role) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, role)}
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

  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("roles.master.subHeader")}
          breadcrumbItems={[
            translate("roles.master.header"),
            translate("roles.master.subHeader"),
          ]}
        />
        <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--xs p-b--xs">
            {translate("roles.master.title")}
          </div>
          <div className="page-master__content">
            <div className="page-master__tag-filter p-t-xxs">
              <TagFilter
                value={filter}
                translate={translate}
                keyTranslate={"roles"}
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
                      value={filter[nameof(list[0].statusId)]["equal"]}
                      placeHolder={translate("roles.placeholder.status")}
                      classFilter={StatusFilter}
                      onChange={handleChangeSelectFilter({
                        fieldName: nameof(list[0].status),
                        fieldType: "equal",
                        classFilter: IdFilter,
                      })}
                      getList={roleRepository.singleListStatus}
                      title={translate("roles.status")}
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
                    classFilter={RoleFilter}
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
        {visible && (
          <RoleAdvanceFilter
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
      </div>
    </>
  );
}
export default RoleMaster;
