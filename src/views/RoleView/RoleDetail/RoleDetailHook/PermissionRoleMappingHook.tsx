import { Modal, PaginationProps } from "antd";
import { Permission, PermissionFilter } from "models/Permission";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { forkJoin, Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import appMessageService from "services/app-message-service";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";
import { tableService } from "services/table-service";
import { webService } from "services/web-service";
export function usePermissionRoleMappingHook(
  modelFilterClass: new () => PermissionFilter,
  getList: (filter: PermissionFilter) => Observable<Permission[]>,
  getTotal: (filter: PermissionFilter) => Observable<number>,
  deleteItem?: (t: Permission) => Observable<Permission>, // pass repo.delete here
  id?: number
) {
  const [subscription] = webService.useSubscription();
  const [toggle, setToggle] = useState<boolean>(false);
  const [translate] = useTranslation();

  // toggle search method, expose this
  const handleToggleSearch = useCallback(() => {
    const toggleTmp = !toggle;
    setToggle(toggleTmp);
  }, [toggle, setToggle]);
  const [list, setList] = useState<Permission[]>([]);
  const [total, setTotal] = useState<number>(undefined);

  const [filter, setFilter] = React.useReducer<
    React.Reducer<PermissionFilter, FilterAction<PermissionFilter>>
  >(filterReducer, new PermissionFilter());
  const [loading, setLoading] = useState<boolean>(false);
  const {
    loadList,
    setLoadList,
    handleSearch,
    handleChangeInputFilter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    handleResetFilter,
  } = filterService.useFilter<PermissionFilter>(filter, setFilter);
  useEffect(() => {
    if (id) {
      if (loadList) {
        filter["roleId"]["equal"] = id;
        setLoading(true);
        const getNCountItems = forkJoin([getList(filter), getTotal(filter)])
          .pipe(
            finalize(() => {
              setLoading(false);
            })
          )
          .subscribe(
            (results: [Permission[], number]) => {
              setList([...results[0]]);
              setTotal(Number(results[1]));
              setLoading(false);
              setLoadList(false);
            },
            (errors: any) => {}
          );
        subscription.add(getNCountItems);
      }
    }
  }, [filter, getList, getTotal, id, loadList, setLoadList, subscription]);

  const pagination: PaginationProps =
    tableService.usePagination<PermissionFilter>(filter, total);
  const { notifyUpdateItemSuccess, notifyUpdateItemError } =
    appMessageService.useCRUDMessage();
  const handleServerDelete = React.useCallback(
    (item) => {
      Modal.confirm({
        title: translate("general.delete.content"),
        okType: "danger",
        onOk() {
          deleteItem(item)
            .pipe(
              finalize(() => {
                setLoading(false);
              })
            )
            .subscribe(
              (res) => {
                setLoading(false);
                setLoadList(true);
                notifyUpdateItemSuccess({
                  message: "Xóa thành công",
                });
              },
              (errors: any) => {
                notifyUpdateItemError({
                  message: "Xóa thất bại",
                });
              }
            );
        },
      });
    },
    [
      deleteItem,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      setLoadList,
      translate,
    ]
  );

  const { handleTableChange, handlePagination } =
    tableService.useTable<PermissionFilter>(
      filter,
      handleChangeAllFilter,
      handleSearch
    );

  return {
    list,
    total,
    loading,
    filter,
    toggle,
    handleChangeInputFilter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    handleResetFilter,
    handleToggleSearch,
    handleTableChange,
    handleServerDelete,
    handleSearch,
    pagination,
    handlePagination, // optional using
  };
}
