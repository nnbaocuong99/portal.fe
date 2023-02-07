import { RowSelectionType } from "antd/lib/table/interface";
import { Init, InitFilter } from "models/Init";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { initRepository } from "repositories/init-repository";
import { finalize } from "rxjs";
import appMessageService from "services/app-message-service";
import { getAntOrderType } from "services/table-service";

export function useInitMasterHook(
  filter: InitFilter,
  setFilter: (data: any) => void,
  selectionType: RowSelectionType = "checkbox"
) {
  const [translate] = useTranslation();

  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [list, setList] = React.useState<Init[]>([]);
  const { notifyUpdateItemSuccess, notifyUpdateItemError } =
    appMessageService.useCRUDMessage();
  const ref = React.useRef<boolean>(true);
  const handleLoadList = useCallback((filter) => {
    setLoadingList(true);
    initRepository
      .listMasterEntity(filter)
      .pipe(finalize(() => setLoadingList(false)))
      .subscribe((res: Init[]) => setList(res));
  }, []);

  const handleResetList = useCallback(() => {
    setFilter({
      ...filter,
      skip: 0,
      take: 10,
    });
  }, [filter, setFilter]);

  React.useEffect(() => {
    if (ref.current) {
      handleLoadList(new InitFilter());
      ref.current = false;
    }
  }, [handleLoadList]);

  const handleTableChange = useCallback(
    (...[, , sorter]) => {
      let newFilter = { ...filter }; // dont check pagination change because of we customize it
      if (
        sorter.field !== filter.orderBy ||
        sorter.order !== getAntOrderType(filter, sorter.field)
      ) {
        newFilter = {
          ...newFilter,
          orderBy: sorter.field,
          //   orderType: getOrderType(sorter.order),
        };
      } // check sortOrder and sortDirection
      setFilter({ ...newFilter }); // setFilter
    },
    [filter, setFilter]
  );

  const handlePagination = useCallback(
    (skip: number, take: number) => {
      const tempFilter = { ...filter, skip, take };
      handleLoadList(tempFilter);
      setFilter({ ...filter, skip, take });
    },
    [filter, handleLoadList, setFilter]
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<KeyType[]>([]);

  const rowSelection = React.useMemo(
    () => ({
      onChange(selectedRowKeys: any[]) {
        setSelectedRowKeys(selectedRowKeys);
      },
      selectedRowKeys,
      type: selectionType,
      getCheckboxProps: (record: Init) => ({
        disabled: record.used, // Column configuration not to be checked
      }),
    }),
    [selectedRowKeys, selectionType]
  );
  const handleInit = React.useCallback(() => {
    setLoadingList(true);
    initRepository
      .init(selectedRowKeys)
      .pipe(finalize(() => setLoadingList(false)))
      .subscribe(
        (_res) => {
          notifyUpdateItemSuccess({
            message: translate("inits.initSuccess"),
          });
          handleResetList();
        },
        (err) => {
          notifyUpdateItemError({
            message: translate("inits.initError"),
          });
        }
      );
    setSelectedRowKeys([]);
  }, [
    handleResetList,
    notifyUpdateItemError,
    notifyUpdateItemSuccess,
    selectedRowKeys,
    translate,
  ]);
  const handleChangeInputSearch = React.useCallback(
    (value) => {
      const newFilter = { ...filter };
      newFilter["search"] = value;
      handleLoadList(newFilter);
      setFilter(newFilter);
    },
    [filter, handleLoadList, setFilter]
  );
  return {
    list,
    loadingList,
    setLoadingList,
    handleResetList,
    handleLoadList,
    handlePagination,
    handleTableChange,
    rowSelection,
    handleInit,
    handleChangeInputSearch,
    selectedRowKeys,
  };
}
