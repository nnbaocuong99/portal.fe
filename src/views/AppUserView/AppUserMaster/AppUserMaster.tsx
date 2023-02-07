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
import { Dropdown, Menu, Modal, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { APP_USER_ROUTE } from "config/route-consts";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Organization, OrganizationFilter } from "models/Organization";
import { Sex, SexFilter } from "models/Sex";
import { Status, StatusFilter } from "models/Status";
import React, { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
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
import { appUserRepository } from "repositories/app-user-repository";
import { filterService } from "services/filter-service";
import { importExportService } from "services/import-export-service";
import { listService } from "services/list-service";
import { masterService } from "services/master-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import AppUserAdvanceFilter from "./AppUserAdvanceFilter";
import AppUserChangePassView, {
  useAppUserChangePassHook,
} from "./AppUserChangePassHook";
import AppUserRoleMappingView, {
  useAppUserRoleMappingHook,
} from "./AppUserRoleMappingHook";
/* end individual import */

function AppUserMaster() {
  const [translate] = useTranslation();
  const [modelFilter, dispatch] = queryStringService.useQueryString(
    AppUserFilter,
    { skip: 0, take: 10 }
  );
  const history = useHistory();
  const idChangePassword = Number(
    history.location?.search?.replace("?idChangePassword=", "")
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  const importButtonRef: React.LegacyRef<HTMLInputElement> =
    useRef<HTMLInputElement>();

  const { handleListExport, handleExportTemplateList, loading } =
    importExportService.useExport();

  const {
    value: filter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    handleChangeInputSearch,
  } = filterService.useFilter(modelFilter, dispatch);

  const { list, count, loadingList, handleResetList } = listService.useList(
    appUserRepository.list,
    appUserRepository.count,
    filter,
    handleChangeAllFilter
  );
  const { handleImportList } = importExportService.useImport(handleResetList);

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
    appUserRepository.delete,
    appUserRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
  );

  const { handleGoCreate, handleGoDetail, handleDeleteItem } =
    masterService.useMasterAction(APP_USER_ROUTE, handleAction);

  const {
    visibleRole,
    appUser,
    handleOpenRoleView,
    handleCloseRoleView,
    handleSaveRole,
  } = useAppUserRoleMappingHook(() => handleChangeAllFilter);
  const {
    pass,
    cfPass,
    errorVisible,
    errorName,
    visibleChangePass,
    handleChangePass,
    handleChangeConfirmPass,
    handleCloseChangePassView,
    handleSaveNewPass,
    handleOpenchangePassView,
  } = useAppUserChangePassHook(() => handleChangeAllFilter);

  const ref = React.useRef<boolean>(true);
  React.useEffect(() => {
    if (ref.current && idChangePassword) {
      handleOpenchangePassView(idChangePassword);
      ref.current = false;
    }
  }, [handleOpenchangePassView, idChangePassword]);

  const handleChageActive = React.useCallback(
    (currentItem) => {
      Modal.confirm({
        title:
          currentItem.statusId === 1
            ? translate("appUsers.inactive.title")
            : translate("appUsers.active.title"),
        content:
          currentItem.statusId === 1
            ? translate("appUsers.inactive.content")
            : translate("appUsers.active.content"),
        okType: "danger",
        onOk() {
          if (currentItem.statusId === 1) {
            currentItem.statusId = 0;
          } else {
            currentItem.statusId = 1;
          }

          appUserRepository.update(currentItem).subscribe(() => {
            handleChangeAllFilter(filter);
          });
        },
      });
    },
    [filter, handleChangeAllFilter, translate]
  );

  const menuAction = React.useCallback(
    (id: number, appUser: AppUser) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu text-center "
            onClick={() => handleOpenRoleView(id)}
          >
            {translate("general.actions.addRole")}
          </div>
        </Menu.Item>
        <Menu.Item key="2">
          {/* {validAction("update") && ( */}

          <div
            className="ant-action-menu text-center"
            onClick={() => handleChageActive(appUser)}
          >
            {appUser.statusId === 1
              ? translate("appUsers.inactive.title")
              : translate("appUsers.active.title")}
          </div>

          {/* )} */}
        </Menu.Item>
        <Menu.Item key="3">
          <div
            className="ant-action-menu text-center"
            onClick={() => handleOpenchangePassView(id)}
          >
            {translate("general.actions.changePass")}
          </div>
        </Menu.Item>
        <Menu.Item key="4">
          <div
            className="ant-action-menu text-center"
            onClick={handleGoDetail(id)}
          >
            {translate("general.actions.edit")}
          </div>
        </Menu.Item>

        <Menu.Item key="5">
          <div
            className="ant-action-menu text-center"
            onClick={handleDeleteItem(appUser)}
          >
            {translate("general.actions.delete")}
          </div>
        </Menu.Item>
      </Menu>
    ),
    [
      translate,
      handleGoDetail,
      handleDeleteItem,
      handleChageActive,
      handleOpenchangePassView,
      handleOpenRoleView,
    ]
  );

  const columns: ColumnProps<AppUser>[] = useMemo(
    () => [
      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "username"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("appUsers.username")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].username),
        dataIndex: nameof(list[0].username),
        sorter: true,
        sortOrder: getAntOrderType<AppUser, AppUserFilter>(
          filter,
          nameof(list[0].username)
        ),
        ellipsis: true,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "displayName"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("appUsers.displayName")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].displayName),
        dataIndex: nameof(list[0].displayName),
        sorter: true,
        sortOrder: getAntOrderType<AppUser, AppUserFilter>(
          filter,
          nameof(list[0].displayName)
        ),
        ellipsis: true,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "email"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("appUsers.email")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].email),
        dataIndex: nameof(list[0].email),
        sorter: true,
        ellipsis: true,
        sortOrder: getAntOrderType<AppUser, AppUserFilter>(
          filter,
          nameof(list[0].email)
        ),
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "phone"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("appUsers.phone")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].phone),
        dataIndex: nameof(list[0].phone),
        sorter: true,
        sortOrder: getAntOrderType<AppUser, AppUserFilter>(
          filter,
          nameof(list[0].phone)
        ),
        ellipsis: true,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "organization"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("appUsers.organization")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].organization),
        dataIndex: nameof(list[0].organization),
        sorter: true,
        ellipsis: true,
        sortOrder: getAntOrderType<AppUser, AppUserFilter>(
          filter,
          nameof(list[0].organization)
        ),
        render(organization: Organization) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={organization?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "phone"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("appUsers.phone")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].sex),
        dataIndex: nameof(list[0].sex),
        sorter: true,
        ellipsis: true,
        // width: 120,
        sortOrder: getAntOrderType<AppUser, AppUserFilter>(
          filter,
          nameof(list[0].sex)
        ),
        render(sex: Sex) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={sex?.name} />
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
                title={translate("appUsers.status")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        sortOrder: getAntOrderType<AppUser, AppUserFilter>(
          filter,
          nameof(list[0].status)
        ),
        // width: 120,
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
        render(id: number, appUser: AppUser) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, appUser)}
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
            title={translate("appUsers.master.subHeader")}
            breadcrumbItems={[
              translate("appUsers.master.header"),
              translate("appUsers.master.subHeader"),
            ]}
          />

          <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
            <div className="page-master__title p-l--sm p-t--xs p-b--xs">
              {translate("appUsers.master.title")}
            </div>
            <div className="page-master__content">
              <div className="page-master__tag-filter">
                <TagFilter
                  value={filter}
                  translate={translate}
                  keyTranslate={"appUsers"}
                  handleChangeFilter={handleChangeAllFilter}
                  onClear={() => {
                    return 0;
                  }}
                />
              </div>
              {(!selectedRowKeys || selectedRowKeys?.length === 0) && (
                <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
                  <div className="page-master__filter d-flex align-items-center justify-content-start">
                    <div className="">
                      <AdvanceIdFilterMaster
                        value={filter[nameof(list[0].organizationId)]["equal"]}
                        placeHolder={translate(
                          "appUsers.placeholder.organization"
                        )}
                        classFilter={OrganizationFilter}
                        onChange={handleChangeSelectFilter({
                          fieldName: nameof(list[0].organization),
                          fieldType: "equal",
                          classFilter: IdFilter,
                        })}
                        getList={appUserRepository.filterListOrganization}
                        title={translate("appUsers.organization")}
                      />
                    </div>

                    <div className="">
                      <AdvanceIdFilterMaster
                        value={filter[nameof(list[0].sexId)]["equal"]}
                        placeHolder={translate("appUsers.placeholder.sex")}
                        classFilter={SexFilter}
                        onChange={handleChangeSelectFilter({
                          fieldName: nameof(list[0].sex),
                          fieldType: "equal",
                          classFilter: IdFilter,
                        })}
                        getList={appUserRepository.filterListSex}
                        title={translate("appUsers.sex")}
                      />
                    </div>
                    <div className="">
                      <AdvanceIdFilterMaster
                        value={filter[nameof(list[0].statusId)]["equal"]}
                        placeHolder={translate("appUsers.placeholder.status")}
                        classFilter={StatusFilter}
                        onChange={handleChangeSelectFilter({
                          fieldName: nameof(list[0].status),
                          fieldType: "equal",
                          classFilter: IdFilter,
                        })}
                        getList={appUserRepository.filterListStatus}
                        title={translate("appUsers.status")}
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
                      classFilter={AppUserFilter}
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
                        onChange={handleImportList(appUserRepository.import)}
                        onClick={() => {
                          importButtonRef.current.value = null;
                        }}
                      />
                      <Button
                        type="icon-only-ghost"
                        icon={<Download16 />}
                        onClick={handleListExport(
                          filter,
                          appUserRepository.export
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
                          appUserRepository.exportTemplate
                        )}
                        className="btn--xl"
                      />
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
      </Spin>

      {visible && (
        <AppUserAdvanceFilter
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
      {visibleRole && (
        <AppUserRoleMappingView
          model={appUser}
          isOpenRoleModel={visibleRole}
          handleCloseRoleModel={handleCloseRoleView}
          onSave={handleSaveRole}
          translate={translate}
        />
      )}
      {visibleChangePass && (
        <AppUserChangePassView
          pass={pass}
          cfPass={cfPass}
          errorVisible={errorVisible}
          errorName={errorName}
          visibleChangePass={visibleChangePass}
          handleChangePass={handleChangePass}
          handleChangeConfirmPass={handleChangeConfirmPass}
          handleCloseChangePassView={handleCloseChangePassView}
          handleSaveNewPass={handleSaveNewPass}
          translate={translate}
        />
      )}
    </>
  );
}
export default AppUserMaster;
