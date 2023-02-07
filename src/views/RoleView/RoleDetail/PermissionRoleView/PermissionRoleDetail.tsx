/* begin general import */
import {
  Add16,
  OverflowMenuHorizontal16,
  SettingsAdjust16,
} from "@carbon/icons-react";
import { Dropdown, Menu as MenuAntd } from "antd";
import { AxiosError } from "axios";
import { masterTableIndex } from "helpers/table";
import { MenuFilter } from "models/Menu";
import { Permission, PermissionFilter } from "models/Permission";
import { Role, RoleFilter } from "models/Role";
import { Status } from "models/Status";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IdFilter } from "react3l-advanced-filters";
import {
  AdvanceIdFilterMaster,
  Button,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
  TagFilter,
} from "react3l-ui-library";
import InputSearch from "react3l-ui-library/build/components/Input/InputSearch";
import { roleRepository } from "repositories/role-repository";
import appMessageService from "services/app-message-service";
import { detailService } from "services/detail-service";
import { getAntOrderType } from "services/table-service";
import { webService } from "services/web-service";
import nameof from "ts-nameof.macro";
import { usePermissionRoleMappingHook } from "../RoleDetailHook/PermissionRoleMappingHook";
import PermissionRoleAdvanceFilter from "./PermissionRoleAdvanceFilter";
// import "./PermissionRoleDetail.scss";
import permissionRoleDetailStyle from "./PermissionRoleDetail.module.scss";
import PermissionDetailModal from "./PermissionRoleDetailModal";

/* end individual import */
interface PermissionRoleDetailProps {
  role: Role;
}

function PermissionRoleDetail(props: PermissionRoleDetailProps) {
  const { role } = props;
  const [translate] = useTranslation();
  // const { id }: any = queryStringService.useGetQueryString("id");
  const [visible, setVisible] = React.useState<boolean>(false);
  const [subscription] = webService.useSubscription();
  const { notifyUpdateItemSuccess, notifyUpdateItemError } =
    appMessageService.useCRUDMessage();
  const handleCancel = React.useCallback(() => {
    setVisible(false);
  }, []);
  const {
    list,
    total,
    loading,
    filter,
    handleChangeSelectFilter,
    handleTableChange,
    handleServerDelete,
    handleSearch,
    handlePagination,
    handleChangeAllFilter,
  } = usePermissionRoleMappingHook(
    PermissionFilter,
    roleRepository.listPermission,
    roleRepository.countPermission,
    roleRepository.deletePermission,
    role?.id
  );

  const newFilter = { ...filter, roleId: new IdFilter() };

  const {
    model,
    isOpenDetailModal,
    handleChangeAllField,
    handleOpenDetailModal,
    handleCloseDetailModal,
    loadingModel,
    handleChangeSingleField,
    dispatch,
  } = detailService.useDetailModal(
    Permission,
    roleRepository.getPermission,
    roleRepository.savePermission,
    handleSearch
  );
  const handleSave = React.useCallback(() => {
    model.roleId = role.id;
    subscription.add(
      roleRepository.savePermission(model).subscribe({
        next: (item: Permission) => {
          handleChangeAllField(item);
          handleCloseDetailModal();
          notifyUpdateItemSuccess({
            message: "Cập nhật thành công",
            className: "antd-notification-drawer",
          });
          handleSearch();
        },
        error: (error: AxiosError<Permission>) => {
          if (error.response && error.response.status === 400) {
            const tempModel = { ...error.response?.data };
            tempModel.permissionActionMappings = undefined;
            tempModel.permissionContents = undefined;
            handleChangeAllField(tempModel);
          }

          notifyUpdateItemError({
            message: "Cập nhật thất bại",
            className: "antd-notification-drawer",
          });
        },
      })
    );
  }, [
    handleChangeAllField,
    handleCloseDetailModal,
    handleSearch,
    role.id,
    model,
    notifyUpdateItemError,
    notifyUpdateItemSuccess,
    subscription,
  ]);

  const handleGoCreate = React.useCallback(() => {
    handleOpenDetailModal(null);
  }, [handleOpenDetailModal]);
  const handleGoDetail = React.useCallback(
    (id: number) => () => {
      handleOpenDetailModal(id);
    },
    [handleOpenDetailModal]
  );

  const menuAction = React.useCallback(
    (id: number, permission: Permission) => (
      <MenuAntd>
        <MenuAntd.Item key="1">
          <div className="ant-action-menu" onClick={handleGoDetail(id)}>
            {translate("general.actions.edit")}
          </div>
        </MenuAntd.Item>
        <MenuAntd.Item key="2">
          <div
            className="ant-action-menu"
            onClick={() => handleServerDelete(permission)}
          >
            {translate("general.actions.delete")}
          </div>
        </MenuAntd.Item>
      </MenuAntd>
    ),
    [handleGoDetail, handleServerDelete, translate]
  );

  const columns: any[] = useMemo(
    () => [
      {
        title: (
          <LayoutHeader
            orderType="center"
            title={translate("general.columns.index")}
          />
        ),
        key: "index",
        width: 50,
        align: "center",
        render: masterTableIndex<Permission, PermissionFilter>(filter),
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("permissions.code")}
          />
        ),

        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        width: 150,
        render(...params: [string, Permission, number]) {
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
            title={translate("permissions.name")}
          />
        ),
        width: 150,
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),

        render(...params: [string, Permission, number]) {
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
            title={translate("permissions.menu")}
          />
        ),

        width: 150,
        key: nameof(list[0].menu),
        dataIndex: nameof(list[0].menu),

        render(...params: [string, Permission, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[1]?.menu?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("permissions.status")}
          />
        ),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sortOrder: getAntOrderType<Permission, PermissionFilter>(
          filter,
          nameof(list[0].status)
        ),
        align: "left",
        width: 150,
        render(...params: [Status, Permission, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <div
                className={
                  params[1]?.statusId === 1
                    ? "status__icon-active m-r--sm"
                    : "status__icon-inactive m-r--sm"
                }
              />
              <OneLineText value={params[0]?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="center"
            title={translate("general.actions.label")}
          />
        ),

        key: "action",
        dataIndex: nameof(list[0].id),
        fixed: "right",
        width: 80,
        align: "center",
        render(id: number, permission: Permission) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, permission)}
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
    [filter, list, menuAction, translate]
  );

  return (
    <div
      className={`${permissionRoleDetailStyle["permission-role-detai_content_table"]}  page-content `}
    >
      <div className="page page-master m-t--lg m-b--xxs">
        <div className="page-master__content">
          <div className="page-master__tag-filter">
            <TagFilter
              value={newFilter}
              translate={translate}
              keyTranslate={"permissions"}
              handleChangeFilter={handleChangeAllFilter}
              onClear={(value: any) => {
                return 0;
              }}
            />
          </div>
          <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
            <div className="page-master__filter d-flex align-items-center justify-content-start">
              <div className="">
                <AdvanceIdFilterMaster
                  value={filter[nameof(list[0].menuId)]["equal"]}
                  placeHolder={translate("permissions.placeholder.menu")}
                  classFilter={MenuFilter}
                  onChange={handleChangeSelectFilter({
                    fieldName: "menu",
                    fieldType: "equal",
                    classFilter: IdFilter,
                  })}
                  getList={roleRepository.singleListMenu}
                  title={translate("permissions.menu")}
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
                  classFilter={RoleFilter}
                  placeHolder={translate("general.placeholder.search")}
                  onChangeSearchField={handleChangeSelectFilter({
                    fieldName: "search",
                    fieldType: "",
                    classFilter: IdFilter,
                  })}
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
                  {translate("general.button.add")}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="page-master__content-table">
          <StandardTable
            rowKey={nameof(list[0].id)}
            columns={columns}
            pagination={false}
            isDragable
            dataSource={list}
            loading={loading}
            tableSize="sm"
            onChange={handleTableChange}
          />
          <Pagination
            skip={filter.skip}
            take={filter.take}
            total={total}
            onChange={handlePagination}
            style={{ margin: "10px" }}
          />
        </div>
        {visible && (
          <PermissionRoleAdvanceFilter
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
        {isOpenDetailModal && (
          <PermissionDetailModal
            model={model}
            visible={isOpenDetailModal}
            handleSave={handleSave}
            handleCancel={handleCloseDetailModal}
            onChangeSimpleField={handleChangeSingleField}
            dispatchModel={dispatch}
            loading={loadingModel}
            visibleFooter={true}
            setModel={handleChangeAllField}
            siteId={role?.siteId}
          />
        )}
      </div>
    </div>
  );
}

export default PermissionRoleDetail;
