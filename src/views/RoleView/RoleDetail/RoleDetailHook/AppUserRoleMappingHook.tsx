/* begin general import */
import { TrashCan16 } from "@carbon/icons-react";
import { masterTableIndex, renderMasterIndex } from "helpers/table";
import { AppUser, AppUserFilter } from "models/AppUser";
import {
  AppUserRoleMapping,
  AppUserRoleMappingFilter,
} from "models/AppUserRoleMapping";
/* end general import */
/* begin individual import */
import { Role } from "models/Role";
import React from "react";
import { useTranslation } from "react-i18next";
import { StringFilter } from "react3l-advanced-filters";
import {
  AdvanceStringFilter,
  LayoutCell,
  LayoutHeader,
  OneLineText,
} from "react3l-ui-library";
import {
  CreateColumn,
  CreateTableColumns,
} from "services/component-factory/table-column-service";
import { detailService } from "services/detail-service";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";
import { listService } from "services/list-service";
import { mappingToMapper, tableService } from "services/table-service";

import nameof from "ts-nameof.macro";
/* end individual import */

export function useAppUserRoleMappingTable(
  model: Role,
  setModel: (data: Role) => void
) {
  const [translate] = useTranslation();

  const { content: appUserRoleMappings, setContent: setAppUserRoleMappings } =
    detailService.useContentList(
      model,
      setModel,
      nameof(model.appUserRoleMappings)
    );

  const [appUsers, setAppUsers] = React.useState<AppUser[]>([]);
  const [list, setList] = React.useState<AppUser[]>([]);
  const count = appUsers?.length;
  const [appUserFilter, dispatchAppUserFilter] = React.useReducer<
    React.Reducer<AppUserRoleMappingFilter, FilterAction<AppUserFilter>>
  >(filterReducer, new AppUserFilter());

  const {
    loadList,
    setLoadList,
    handleSearch,
    handleResetFilter,
    handleChangeAllFilter,
    handleChangeSelectFilter,
  } = filterService.useFilter<AppUserRoleMappingFilter>(
    appUserFilter,
    dispatchAppUserFilter
  );
  React.useEffect(() => {
    if (appUserRoleMappings && appUserRoleMappings.length > 0) {
      const list = appUserRoleMappings.map((item: AppUserRoleMapping) => {
        const user = item.appUser;
        // user = ;
        // user.rowId = item?.rowId;
        // user.roleId = model?.id;
        return user;
      });
      setAppUsers([...list]);
      setLoadList(true);
    }
  }, [appUserRoleMappings, model?.id, setLoadList]);
  const { sortList, filterList } = listService.useFilterList(appUserFilter);

  const handleFilter = React.useCallback(
    (list: any[]) => {
      return sortList(filterList(list));
    },
    [sortList, filterList]
  );
  const handleDeleteAppUser = React.useCallback(
    (user) => {
      const listAppUser = appUsers.filter((i: AppUser) => i.id !== user.id);
      setAppUsers([...listAppUser]);
      const list =
        listAppUser && listAppUser?.length > 0
          ? listAppUser.map((item) => {
              const maping = new AppUserRoleMapping();
              maping.appUser = item;
              maping.appUserId = item?.id;
              return maping;
            })
          : [];
      setAppUserRoleMappings([...list]);
      const tempAppUser =
        list?.length > 0 ? list.map((appUser) => appUser?.appUser) : [];

      const filteredList = handleFilter(tempAppUser);
      setList(filteredList);
    },
    [appUsers, handleFilter, setAppUserRoleMappings]
  );

  React.useEffect(() => {
    if (loadList && appUsers.length > 0) {
      const tempAppUser =
        appUserRoleMappings?.length > 0
          ? appUserRoleMappings.map(
              (appUser: AppUserRoleMapping) => appUser?.appUser
            )
          : [];

      const filteredList = handleFilter(tempAppUser);
      setList(filteredList);
      setLoadList(false);
    }
  }, [appUserRoleMappings, appUsers, handleFilter, loadList, setLoadList]);

  const {
    handleTableChange,
    handlePagination,
    rowSelection,
    canBulkDelete,
    handleLocalBulkDelete,
    handleAddContent,
  } = tableService.useLocalTable<
    AppUserRoleMapping,
    AppUserRoleMapping,
    AppUserRoleMappingFilter
  >(
    appUserFilter,
    handleChangeAllFilter,
    setLoadList,
    handleSearch,
    count,
    appUsers,
    setAppUsers,
    AppUserRoleMapping
  );
  const appUserRoleMappingColumns = React.useMemo(
    () => [
      {
        title: (
          <div className="text-center gradient-text">
            {translate("general.columns.index")}
          </div>
        ),
        key: "index",
        width: 80,
        align: "center",
        render: renderMasterIndex<Role>(),
      },
      {
        title: (
          <>
            <LayoutHeader
              orderType="left"
              title={translate("roles.appUsers.displayName")}
            />
          </>
        ),
        key: nameof(appUsers[0].displayName),
        dataIndex: nameof(appUsers[0].displayName),
        width: 120,
        render(...params: [string, Role, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[1]?.displayName} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <>
            <LayoutHeader
              orderType="left"
              title={translate("roles.appUsers.username")}
            />
          </>
        ),
        key: nameof(appUsers[0].username),
        dataIndex: nameof(appUsers[0].username),
        width: 120,
        render(...params: [string, Role, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[1]?.username} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <>
            <LayoutHeader
              orderType="left"
              title={translate("roles.appUsers.phone")}
            />
          </>
        ),
        key: nameof(appUsers[0].phone),
        dataIndex: nameof(appUsers[0].phone),
        width: 120,
        render(...params: [string, Role, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[1]?.phone} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <>
            <LayoutHeader
              orderType="left"
              title={translate("roles.appUsers.email")}
            />
          </>
        ),
        key: nameof(appUsers[0].email),
        dataIndex: nameof(appUsers[0].email),
        width: 120,
        render(...params: [string, Role, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[1]?.email} />
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
        render(...params: [string, AppUserRoleMapping, number]) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <TrashCan16
                color="red"
                onClick={() => handleDeleteAppUser(params[1])}
              />
            </div>
          );
        },
      },
    ],
    [appUsers, handleDeleteAppUser, list, translate]
  );

  return {
    appUserContentFilter: appUserFilter,
    appUserRoleMappingList: list,
    loadAppUserRoleMappingList: loadList,
    appUserRoleMappingTotal: count,
    handleAddAppUserRoleMapping: handleAddContent,
    handleAppUserRoleMappingTableChange: handleTableChange,
    handleAppUserRoleMappingPagination: handlePagination,
    appUserRoleMappingRowSelection: rowSelection,
    canBulkDeleteAppUserRoleMapping: canBulkDelete,
    handleResetAppUserRoleMappingFilter: handleResetFilter,
    handleLocalBulkDeleteAppUserRoleMapping: handleLocalBulkDelete,
    appUserRoleMappings,
    setAppUserRoleMappings,
    appUserRoleMappingColumns,
    handleSearchAppUserRoleMapping: handleSearch,
    handleChangeAllAppUserRoleMappingFilter: handleChangeAllFilter,
    handleChangeAppUserRoleMappingSelectFilter: handleChangeSelectFilter,
  };
}

export function useAppUserRoleMappingModal(
  source: AppUserRoleMapping[],
  handleSource?: () => void
) {
  const [translate] = useTranslation();
  const [appUserFilter, dispatchAppUserFilter] = React.useReducer<
    React.Reducer<AppUserFilter, FilterAction<AppUserFilter>>
  >(filterReducer, new AppUserFilter());

  const {
    loadList,
    setLoadList,
    handleSearch,
    handleChangeInputFilter,
    handleChangeAllFilter,
    handleResetFilter,
  } = filterService.useFilter<AppUserFilter>(
    appUserFilter,
    dispatchAppUserFilter
  );
  const selectedAppUserList = React.useMemo(
    () => (source?.length > 0 ? source.map(mappingToMapper("appUser")) : []),
    [source]
  );

  const appUserModalFilters = React.useMemo(
    () => [
      <AdvanceStringFilter
        value={appUserFilter["username"]["contain"]}
        onChange={handleChangeInputFilter({
          fieldName: "username",
          fieldType: "contain",
          classFilter: StringFilter,
        })}
        isMaterial={true}
        className={"tio-search"}
        label={translate("roles.appUsers.username")}
        placeHolder={translate("roles.appUsers.placeholder.username")}
      />,

      <AdvanceStringFilter
        value={appUserFilter["displayName"]["contain"]}
        onChange={handleChangeInputFilter({
          fieldName: "displayName",
          fieldType: "contain",
          classFilter: StringFilter,
        })}
        isMaterial={true}
        className={"tio-search"}
        label={translate("roles.appUsers.displayName")}
        placeHolder={translate("roles.appUsers.placeholder.displayName")}
      />,

      <AdvanceStringFilter
        value={appUserFilter["phone"]["contain"]}
        onChange={handleChangeInputFilter({
          fieldName: "phone",
          fieldType: "contain",
          classFilter: StringFilter,
        })}
        isMaterial={true}
        className={"tio-search"}
        label={translate("roles.appUsers.phone")}
        placeHolder={translate("roles.appUsers.placeholder.phone")}
      />,
      <AdvanceStringFilter
        value={appUserFilter["email"]["contain"]}
        onChange={handleChangeInputFilter({
          fieldName: "email",
          fieldType: "contain",
          classFilter: StringFilter,
        })}
        isMaterial={true}
        className={"tio-search"}
        label={translate("roles.appUsers.email")}
        placeHolder={translate("roles.appUsers.placeholder.email")}
      />,
    ],
    [appUserFilter, handleChangeInputFilter, translate]
  );

  const appUserColumns = React.useMemo(
    () =>
      CreateTableColumns(
        CreateColumn()
          .Title(translate("general.columns.index"))
          .Key("index")
          .Width(70)
          .Render(masterTableIndex<AppUser, AppUserFilter>()),

        CreateColumn()
          .Title(translate("roles.appUsers.username"))
          .Key("username")
          .DataIndex("username"),

        CreateColumn()
          .Title(translate("roles.appUsers.displayName"))
          .Key("displayName")
          .DataIndex("displayName"),
        CreateColumn()
          .Title(translate("roles.appUsers.organization"))
          .Key("organization")
          .DataIndex("organization")
          .Render((...[organization]) => {
            return organization?.name;
          }),

        CreateColumn()
          .Title(translate("roles.appUsers.phone"))
          .Key("phone")
          .Align("left")
          .Render((...params: [string, AppUserRoleMapping, number]) => {
            return (
              <LayoutCell orderType="left" tableSize="md">
                <OneLineText value={params[0]} />
              </LayoutCell>
            );
          })
          .DataIndex("phone"),

        CreateColumn()
          .Title(translate("roles.appUsers.email"))
          .Key("email")
          .DataIndex("email")
      ),
    [translate]
  );

  const {
    visible,
    loadControl,
    handleEndControl,
    handleOpenModal,
    handleCloseModal,
    handleSaveModal,
  } = tableService.useContenModal(handleSource);

  const handleOpenAppUserModal = React.useCallback(() => {
    handleOpenModal();
    const ids =
      source && source?.length > 0
        ? source?.map((o) => o?.appUserId)
        : undefined;
    handleChangeAllFilter({
      ...new AppUserFilter(),
      id: { notIn: ids },
      siteId: { equal: 1 },
    });
  }, [handleOpenModal, source, handleChangeAllFilter]);

  React.useEffect(() => {
    if (loadControl) {
      handleSearch();
      handleEndControl();
    }
  }, [handleSearch, loadControl, handleEndControl]);

  return {
    appUserModalFilters,
    visibleAppUser: visible,
    handleOpenAppUserModal,
    handleCloseAppUserModal: handleCloseModal,
    handleSaveAppUserModal: handleSaveModal,
    selectedAppUserList,
    appUserFilter,
    dispatchAppUserFilter,
    appUserColumns,
    loadAppUserList: loadList,
    setLoadAppUserList: setLoadList,
    handleSearchAppUser: handleSearch,
    handleUpdateNewAppUserFilter: handleChangeAllFilter,
    handleResetAppUserFilter: handleResetFilter,
  };
}

export const appUserRoleMappingContentMapper = (
  model: AppUserRoleMapping | AppUser
): AppUserRoleMapping => {
  if (model?.appUser) {
    const { appUser } = model;
    return {
      ...model,
      appUserId: appUser?.id,
      appUser: appUser,
    };
  }

  return appUserRoleMappingContentMapper({
    ...new AppUserRoleMapping(),
    appUser: model as AppUser,
  });
};
