import { Model, ModelFilter } from "react3l-common";
import {
  RowSelectionType,
  SortOrder,
  TableRowSelection,
} from "antd/lib/table/interface";
import React, {
  Dispatch,
  Reducer,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { FilterAction, FilterActionEnum } from "./filter-service";
import { PaginationProps } from "antd/lib/pagination";
import { Observable } from "rxjs";
import { listService } from "./list-service";
import { useTranslation } from "react-i18next";
import { DEFAULT_TAKE } from "config/consts";
import Modal from "antd/lib/modal";

/* services to CRUD, import, export data in table */

export function filterContent<T extends Model>(content: T) {
  return (item: T) => item.key !== content.key;
}

export function getIdsFromContent<T extends Model>(list: T[], fieldId: string) {
  return list.map((item) => item[fieldId]);
}

export function filterContentNotInList<T extends Model>(
  list: any[],
  fieldId: string
) {
  return (item: T) => !list.includes(item[fieldId]);
}

export function filterContentInList<T extends Model>(
  list: any[],
  fieldId: string
) {
  return (item: T) => list.includes(item[fieldId]);
}
export function mappingToMapper<T extends Model>(mapperField: string) {
  return (item: T) => item[mapperField];
}

export interface ContentTableState<
  TMapping extends Model,
  TMapper extends Model = any
  > {
  mappingList?: TMapping[]; // for content table
  mapperList?: TMapper[]; // for content modal table
}

export interface ContentTableAction<
  TMapping extends Model,
  TMapper extends Model = any
  > {
  type: ContentTableActionEnum;
  listName?: string;
  mappingList?: TMapping[];
  mapperList?: TMapper[];
  data?: any[];
}

export enum ContentTableActionEnum {
  SET_LIST_SELECTION,
  SINGLE_DELETE,
  BULK_DELETE,
}
export enum ModalActionEnum {
  OPEN_MODAL,
  CLOSE_MODAL,
  END_LOAD_CONTROL,
  INIT_SEARCH,
}
export interface ModalState {
  visible?: boolean;
  loadControl?: boolean;
}

export interface ModalAction {
  type: ModalActionEnum;
}

function modalTableReducer(state: ModalState, action: ModalAction) {
  switch (action.type) {
    case ModalActionEnum.OPEN_MODAL: {
      return {
        ...state,
        visible: true,
        loadControl: true,
      };
    }
    case ModalActionEnum.CLOSE_MODAL: {
      return {
        ...state,
        visible: false,
        loadControl: false,
      };
    }
    case ModalActionEnum.END_LOAD_CONTROL: {
      return {
        ...state,
        loadControl: false,
      };
    }
    case ModalActionEnum.INIT_SEARCH: {
      return {
        ...state,
        loadControl: true,
      };
    }
  }
}

function contentTableReducer<TMapping extends Model, TMapper extends Model>(
  state: ContentTableState<TMapping, TMapper>,
  action: ContentTableAction<TMapping, TMapper>
) {
  switch (action.type) {
    case ContentTableActionEnum.SINGLE_DELETE: {
      return {
        ...state,
        mappingList: action.mappingList,
      };
    }
    case ContentTableActionEnum.BULK_DELETE: {
      return {
        ...state,
        mappingList: [],
      };
    }
    case ContentTableActionEnum.SET_LIST_SELECTION: {
      return {
        ...state,
        [action.listName]: action.data,
      };
    }
  }
}
export const tableService = {
  usePagination<TFilter extends ModelFilter>(
    filter: TFilter,
    total: number
  ): PaginationProps {
    return useMemo(
      () => ({
        current: Math.ceil(filter.skip / filter.take) + 1,
        pageSize: filter.take,
        total,
      }),
      [filter.skip, filter.take, total]
    );
  },
  /**
   *
   * expose data and event handler for master table service
   * @param: filter: TFilter
   * @param: setFilter: (filter: TFilter) => void
   * @param: handleReloadList: any
   *
   * @return: { handleTableChange, handlePagination }
   *
   * */

  useTable<TFilter extends ModelFilter>(
    filter: TFilter,
    setFilter: (filter: TFilter) => void,
    handleReloadList?: any
  ) {
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
            orderType: getOrderType(sorter.order),
          };
        } // check sortOrder and sortDirection
        setFilter({ ...newFilter }); // setFilter
        if (typeof handleReloadList === "function") {
          handleReloadList();
        } // handleReloadList
      },
      [filter, setFilter, handleReloadList]
    );

    const handlePagination = useCallback(
      (skip: number, take: number) => {
        setFilter({ ...filter, skip, take });
        if (typeof handleReloadList === "function") {
          handleReloadList();
        }
      },
      [filter, setFilter, handleReloadList]
    );

    return {
      handleTableChange,
      handlePagination,
    };
  },

  useContentRowSelection<T extends Model>(
    selectedList: T[],
    setSelectedList: (t: T[]) => void,
    disabled: boolean = false,
    selectionType: RowSelectionType = "checkbox"
  ): {
    rowSelection: TableRowSelection<T>;
    canBulkDelete: boolean;
  } {
    const selectedRowKeys: KeyType[] = useMemo(() => {
      return selectedList.length > 0
        ? selectedList.map((t: T) => (t?.id ? t?.id : t?.key))
        : [];
    }, [selectedList]); // selectedRowKeys accept both string and number for local and server table

    const canBulkDelete = useMemo(
      () => selectedRowKeys.length > 0,
      [selectedRowKeys.length]
    ); // decide when we can enable bulkDelete

    return {
      rowSelection: useMemo(
        () => ({
          preserveSelectedRowKeys: true,
          onSelect: (record: T, selected: boolean) => {
            if (selected) {
              selectedList.push(record);
              setSelectedList([...selectedList]);
            } else {
              setSelectedList(
                selectedList.filter((t: T) => {
                  return t.id ? t.id !== record.id : t.key !== record.key;
                })
              );
            }
          }, // single selection
          onChange: (...[selectedRowKeys, selectedRows]) => {
            if (selectedList?.length === 0) {
              setSelectedList([...selectedRows]);
              return;
            } // if list empty, add all selectedRows to list
            const mapper: Record<any, number> = {}; // create mapper from filter
            selectedRowKeys.forEach((key: any) => {
              mapper[key] = 0;
            });
            const mergeList = [...selectedList, ...selectedRows].filter(
              (item) => typeof item !== "undefined"
            ); // merge old list with new selectedRows
            const filterList: any[] = [];
            mergeList.forEach((item) => {
              if (item !== undefined) {
                const itemId = item?.id ? item?.id : item?.key;
                if (mapper[itemId] === 0) {
                  filterList.push(item);
                  mapper[itemId] = mapper[itemId] + 1;
                }
              }
            }); // filter item which its key contained in selectedRowKeys
            setSelectedList([...filterList]);
          }, // multi selection
          getCheckboxProps: () => ({
            disabled,
          }), // pass external control for disabling selection
          type: selectionType, // selection type
          selectedRowKeys, // selectedRowKey
        }),
        [
          disabled,
          selectedList,
          selectedRowKeys,
          selectionType,
          setSelectedList,
        ]
      ),
      canBulkDelete,
    };
  },
  useContenModal(handleSource?: () => void) {
    const [{ visible, loadControl }, dispatch] = useReducer<
      Reducer<ModalState, ModalAction>
    >(modalTableReducer, {
      visible: false,
      loadControl: false,
    });

    const handleOpenModal = useCallback(() => {
      dispatch({ type: ModalActionEnum.OPEN_MODAL });
    }, []);

    const handleCloseModal = useCallback(() => {
      dispatch({ type: ModalActionEnum.CLOSE_MODAL });
    }, []);

    const handleSaveModal = useCallback(() => {
      dispatch({ type: ModalActionEnum.CLOSE_MODAL });
      if (typeof handleSource === "function") {
        handleSource(); // trigger reload list
      }
    }, [handleSource]);

    const handleEndControl = useCallback(() => {
      dispatch({ type: ModalActionEnum.END_LOAD_CONTROL });
    }, []);

    const handleSearchModal = useCallback(() => {
      dispatch({ type: ModalActionEnum.INIT_SEARCH });
    }, []);

    return {
      visible,
      loadControl,
      handleEndControl,
      handleOpenModal,
      handleCloseModal,
      handleSaveModal,
      handleSearchModal,
    };
  },
  useModalTable<T extends Model, TFilter extends ModelFilter>(
    filter: TFilter,
    setFilter: (filter: TFilter) => void, // from TFilter to TFilter
    loadList: boolean,
    setLoadList: Dispatch<SetStateAction<boolean>>,
    handleSearch: () => void,
    getList: (filter: TFilter) => Observable<T[]>,
    getTotal: (filter: TFilter) => Observable<number>,
    mapperList?: T[]
  ) {
    // mappingList, mapperList reducer
    const [{ mapperList: selectedList }, dispatch] = useReducer<
      Reducer<ContentTableState<T>, ContentTableAction<T>>
    >(contentTableReducer, {
      mapperList: mapperList ?? [],
    });
    const setSelectedList = useCallback((list: T[]) => {
      dispatch({
        type: ContentTableActionEnum.SET_LIST_SELECTION,
        listName: "mapperList",
        data: list,
      });
    }, []);

    // selectedRowKeys
    const { rowSelection } = this.useContentRowSelection(
      selectedList,
      setSelectedList
    );

    // define setMapperList alternater for setSelectedList
    const setMapperList = useCallback((mapperList: T[]) => {
      dispatch({
        type: ContentTableActionEnum.SET_LIST_SELECTION,
        listName: "mapperList",
        data: mapperList, // update mappingList.Eg: selectedContent[]
      });
    }, []);

    // update mapperList when source changed
    useEffect(() => {
      if (mapperList) {
        setMapperList(mapperList);
      }
    }, [mapperList, setMapperList]);

    // from filter and source we calculate dataSource, total and loadingList
    const { list, count, loadingList } = listService.useList(
      getList,
      getTotal,
      filter
    );

    // calculate pagination
    const pagination: PaginationProps = this.usePagination<TFilter>(
      filter,
      count
    );

    // handleChange page or sorter
    const { handleTableChange, handlePagination } = this.useTable<TFilter>(
      filter,
      setFilter,
      handleSearch
    );

    return {
      list,
      count,
      loadingList,
      pagination,
      handleTableChange,
      handlePagination,
      rowSelection,
      selectedList,
      setSelectedList,
    };
  },

  useLocalTable<T extends Model, T2 extends Model, TFilter extends ModelFilter>(
    filter: TFilter,
    setFilter: (filter: TFilter) => void,
    setLoadList: Dispatch<SetStateAction<boolean>>,
    handleSearch: () => void,
    total: number,
    source: T[],
    setSource: (source: T[]) => void,
    ContentClass: new () => T
  ) {
    const [translate] = useTranslation();

    const [{ mappingList }, dispatch] = useReducer<
      Reducer<ContentTableState<T, T2>, ContentTableAction<T, T2>>
    >(contentTableReducer, {
      mappingList: [], // selectedContent
    }); // mappingList, mapperList reducer

    const setMappingList = useCallback((mappingList: T[]) => {
      dispatch({
        type: ContentTableActionEnum.SET_LIST_SELECTION,
        listName: "mappingList",
        data: mappingList, // update mappingList.Eg: selectedContent[]
      });
    }, []); // define setMappingList alternater for setSelectedContent

    const {
      rowSelection,
      canBulkDelete, // for UI
    } = this.useContentRowSelection(mappingList, setMappingList); // selectedRowKeys

    const pagination: PaginationProps = this.usePagination<TFilter>(
      filter,
      total
    ); // calculate pagination

    const { handleTableChange, handlePagination } = this.useTable<TFilter>(
      filter,
      setFilter,
      handleSearch
    ); // handleChange page or sorter

    const resetTableFilter = useCallback(() => {
      setFilter({ ...filter, skip: 0, take: DEFAULT_TAKE }); // set default skip. take for filter
      handleSearch(); // trigger reLoad list
    }, [filter, handleSearch, setFilter]); // reset table filter and re-load

    const handleLocalDelete = useCallback(
      (content: T) => {
        setSource(source.filter(filterContent(content))); // remove one item in source by key and update source
        dispatch({
          type: ContentTableActionEnum.SINGLE_DELETE,
          mappingList: mappingList.filter(filterContent(content)), // for content table
        });
        resetTableFilter();
      },
      [mappingList, resetTableFilter, setSource, source]
    ); // handle single delete

    const handleLocalBulkDelete = useCallback(() => {
      Modal.confirm({
        title: translate("general.delete.content"),
        okType: "danger",
        onOk() {
          setSource(
            source.filter(
              filterContentNotInList(
                getIdsFromContent(mappingList, `key`),
                `key`
              )
            )
          ); // update source
          dispatch({
            type: ContentTableActionEnum.BULK_DELETE,
          });
          resetTableFilter();
        },
      });
    }, [mappingList, resetTableFilter, setSource, source, translate]); //  handle bulk delete by keys

    const handleChangeOneCell = useCallback(
      (index: number, field: keyof T) => (value: T[keyof T], object?: any) => {
        if (index !== -1) {
          if (typeof object === "object") {
            source[index][field] = object;
            source[index][`${String(field)}Id` as keyof T] = value;
          } else {
            source[index][field] = value;
          }
        }
        setSource(source);
        resetTableFilter();
      },
      [setSource, source, resetTableFilter]
    ); // update one cell in source

    const handleChangeOneRow = useCallback(
      (index: number) => (value: T) => {
        source[index] = value;
        setSource(source);
        resetTableFilter();
      },
      [source, resetTableFilter, setSource] // change one row
    );

    const handleChangeAllRow = useCallback(
      (source: T[]) => {
        const sourceValue = [...source];
        setSource(sourceValue);
        resetTableFilter();
      },
      [resetTableFilter, setSource]
    );

    const handleAddContent = useCallback(() => {
      source?.length > 0
        ? setSource([...source, new ContentClass()])
        : setSource([new ContentClass()]);
      setLoadList(true);
    }, [ContentClass, setLoadList, setSource, source]); // add Content

    return {
      handleSearch,
      pagination,
      handleTableChange,
      handlePagination,
      rowSelection,
      canBulkDelete,
      selectedContent: mappingList,
      resetTableFilter, // reset filter and trigger search
      handleLocalDelete, // single delete
      handleLocalBulkDelete, // bulk delete
      handleChangeOneCell, // update single row by field and keys
      handleChangeOneRow, // update single row
      handleChangeAllRow, // update multiple row
      handleAddContent, // add single
    };
  },

  useContentTable<T extends Model, TFilter extends ModelFilter>(
    ClassFilter: new () => TFilter,
    ClassContent: new () => T,
    data: T[],
    setData: (t: T[]) => void,
    dispatchFilter: React.Dispatch<FilterAction<TFilter>>,
    handleInvokeChange?: () => void
  ) {
    const handleResetTable = useCallback(() => {
      const newFilter = new ClassFilter();
      dispatchFilter({ type: FilterActionEnum.SET, payload: newFilter });
      if (typeof handleInvokeChange === "function") {
        handleInvokeChange();
      }
    }, [ClassFilter, dispatchFilter, handleInvokeChange]);

    const handlePagination = useCallback(
      (skip: number, take: number) => {
        const newFilter = { ...new ClassFilter(), skip, take };
        dispatchFilter({ type: FilterActionEnum.SET, payload: newFilter });
        if (typeof handleInvokeChange === "function") {
          handleInvokeChange();
        }
      },
      [dispatchFilter, handleInvokeChange, ClassFilter]
    );

    const handleChangeCell = useCallback(
      (key: string, columnKey: keyof T, value?: T[keyof T]) => {
        const rowIdx = data.findIndex((current) => current.key === key);
        if (rowIdx !== -1) {
          data[rowIdx][columnKey] = value;
        }
        setData(data);
        if (typeof handleInvokeChange === "function") {
          handleInvokeChange();
        }
      },
      [data, setData, handleInvokeChange]
    );

    const handleChangeRow = useCallback(
      (key: string, value: T) => {
        const rowIdx = data.findIndex((current) => current.key === key);
        if (rowIdx !== -1) {
          data[rowIdx] = value;
        }
        setData(data);
        if (typeof handleInvokeChange === "function") {
          handleInvokeChange();
        }
      },
      [data, setData, handleInvokeChange]
    );

    const handleAddRow = useCallback(() => {
      data.push(new ClassContent());
      setData(data);
      if (typeof handleInvokeChange === "function") {
        handleInvokeChange();
      }
    }, [ClassContent, data, setData, handleInvokeChange]);

    const handleDeleteRow = useCallback(
      (key: string) => {
        if (data && data.length > 0) {
          const rowIdx = data.findIndex((current) => current.key === key);
          data.splice(rowIdx, 1);
          setData(data);
        }
      },
      [data, setData]
    );

    return {
      handleResetTable,
      handlePagination,
      handleChangeCell,
      handleChangeRow,
      handleAddRow,
      handleDeleteRow,
    };
  },

};

export function getAntOrderType<T extends Model, TFilter extends ModelFilter>(
  tFilter: TFilter,
  columnName: keyof T
): SortOrder {
  if (tFilter.orderBy === columnName) {
    switch (tFilter.orderType) {
      case "ASC":
        return "ascend";

      case "DESC":
        return "descend";

      default:
        return undefined;
    }
  }
  return undefined;
}

export function getOrderType(sortOrder?: SortOrder) {
  switch (sortOrder) {
    case "ascend":
      return "ASC";

    case "descend":
      return "DESC";

    default:
      return undefined;
  }
}
