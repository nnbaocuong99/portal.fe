import { RowSelectionType } from "antd/lib/table/interface";
import { DEFAULT_TAKE } from "config/consts";
import _ from "lodash";
import { Moment } from "moment";
import {
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState
} from "react";
import {
  DateFilter,
  IdFilter,
  NumberFilter,
  StringFilter
} from "react3l-advanced-filters";
import { Model, ModelFilter, OrderType } from "react3l-common";
import { finalize, forkJoin, Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import appMessageService from "./app-message-service";
import { webService } from "./web-service";

export enum ListActionType {
  SET = "SET",
}

export type KeyType = string | number;

export interface ListState<T extends Model> {
  list: T[];
  count: number;
}

export interface ListAction<T extends Model> {
  type: string;
  payload?: ListState<T>;
}

function listReducer<T>(state: ListState<T>, action: ListAction<T>) {
  switch (action.type) {
    case ListActionType.SET:
      return { ...action.payload };
    default:
      return state;
  }
}

export const listService = {
  /**
   * @param: getList: (filter: TFilter) => Observable<T[]>
   * @param: getCount: (filter: TFilter) => Observable<number>
   * @param: filter: TFilter
   * @param: initData: ListState<T>
   * */
  useList<T extends Model, TFilter extends ModelFilter>(
    getList: (filter: TFilter) => Observable<T[]>,
    getCount: (filter: TFilter) => Observable<number>,
    filter: TFilter,
    setFilter?: (filter: TFilter) => void,
    initData?: ListState<T>,
    autoCallListByChange: boolean = true
  ) {
    const [{ list, count }, dispatch] = useReducer<
      Reducer<ListState<T>, ListAction<T>>
    >(listReducer, initData ? initData : { list: [], count: 0 });

    const [loadingList, setLoadingList] = useState<boolean>(false);

    // const defaultFilter = useMemo(() => {
    //   return { ...filter, skip: 0, take: 10 };
    // }, [filter]);

    const [subscription] = webService.useSubscription();

    const handleLoadList = useCallback(() => {
      subscription.add(
        forkJoin([getList(filter), getCount(filter)])
          .pipe(finalize(() => setLoadingList(false)))
          .subscribe({
            next: (results: [T[], number]) =>
              dispatch({
                type: ListActionType.SET,
                payload: {
                  list: results[0],
                  count: results[1],
                },
              }),
          })
      );
    }, [filter, getCount, getList, subscription]);

    const handleResetList = useCallback(() => {
      setFilter({
        ...filter, skip: 0, take: 10,
      });

    }, [filter, setFilter]);

    useEffect(() => {
      if (filter && autoCallListByChange) {
        setLoadingList(true);
        handleLoadList();
      }
    }, [autoCallListByChange, filter, handleLoadList]);

    return {
      list,
      count,
      loadingList,
      setLoadingList,
      handleResetList,
      handleLoadList,
    };
  },

  /**
   *
   * @param: action?: (t: T) => Observable<T>,
   * @param: bulkAction?: (ids: KeyType[]) => Observable<void>,
   * @param: selectedKeys?: KeyType[],
   * @param: setSelectedRowKeys?: Dispatch<SetStateAction<KeyType[]>>,
   * @param: onUpdateListSuccess?: (item?: T) => void,
   * @param: handleResetList?: () => void
   */
  useRowSelection<T extends Model>(
    action?: (t: T) => Observable<T>,
    bulkAction?: (ids?: KeyType[]) => Observable<void>,
    selectionType: RowSelectionType = "checkbox",
    initialRowKeys?: KeyType[],
    onUpdateListSuccess?: (item?: T) => void,
    handleResetList?: () => void
  ) {
    const [subscription] = webService.useSubscription();

    const { notifyUpdateItemSuccess, notifyUpdateItemError } =
      appMessageService.useCRUDMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<KeyType[]>(
      initialRowKeys ?? []
    );

    const canBulkAction = useMemo(
      () => selectedRowKeys.length > 0,
      [selectedRowKeys.length]
    );

    const rowSelection = useMemo(
      () => ({
        onChange(selectedRowKeys: KeyType[]) {
          setSelectedRowKeys(selectedRowKeys);
        },
        selectedRowKeys,
        type: selectionType,
        getCheckboxProps: (record: T) => ({
          disabled: record.used, // Column configuration not to be checked
        }),
      }),
      [selectedRowKeys, selectionType]
    );

    const handleAction = useCallback(
      (item: T) => {
        if (typeof action !== undefined) {
          subscription.add(
            action(item).subscribe({
              next: (_res) => {
                if (typeof onUpdateListSuccess === "function") {
                  onUpdateListSuccess(item);
                }
                setSelectedRowKeys(
                  (selectedRowKeys as number[]).filter((id) => id !== item.id)
                );
                notifyUpdateItemSuccess({
                  message: "Xóa thành công",
                });
                handleResetList();
              },
              error: () => {
                notifyUpdateItemError({
                  message: "Xóa thất bại",
                });
              },
            })
          );
        }
      },
      [
        action,
        subscription,
        onUpdateListSuccess,
        selectedRowKeys,
        notifyUpdateItemSuccess,
        handleResetList,
        notifyUpdateItemError,
      ]
    );

    const handleBulkAction = useCallback(
      (keys?: KeyType[]) => {
        if (typeof bulkAction !== undefined) {
          subscription.add(
            bulkAction(keys).subscribe({
              next: (_res) => {
                if (typeof onUpdateListSuccess === "function") {
                  onUpdateListSuccess();
                }
                setSelectedRowKeys([]);
                notifyUpdateItemSuccess({
                  message: "Xóa thành công",
                });
                handleResetList();
              },
              error: () => {
                notifyUpdateItemError({
                  message: "Xóa thất bại",
                });
              },
            })
          );
        }
      },
      [
        bulkAction,
        subscription,
        onUpdateListSuccess,
        notifyUpdateItemSuccess,
        handleResetList,
        notifyUpdateItemError,
      ]
    );

    return {
      handleAction,
      handleBulkAction,
      canBulkAction,
      rowSelection,
      selectedRowKeys,
      setSelectedRowKeys,
    };
  },

  useLocalList<T extends Model & { key?: string }, TFilter extends ModelFilter>(
    data: T[],
    filter?: TFilter,
    autoCallByChange: boolean = true,
    fieldCombineSearch?: string[]
  ) {
    const contentValue = useMemo(() => {
      if (data && data.length > 0) {
        return data.map((current: T) => {
          if (typeof current.key !== undefined) {
            return current;
          } else {
            current.key = uuidv4();
            return current;
          }
        });
      }
      return [];
    }, [data]);

    const [{ list, count }, dispatch] = useReducer<
      Reducer<ListState<T>, ListAction<T>>
    >(listReducer, {
      list: contentValue || [],
      count: contentValue ? contentValue.length : 0,
    });

    const [invokeChange, setInvokeChange] = useState<boolean>(false);

    const { sortList, filterList, combineFilterList } = this.useFilterList<
      T,
      TFilter
    >(filter);

    const handleInvokeChange = useCallback(() => {
      setInvokeChange(true);
    }, []);

    const handleFilter: (list: T[]) => T[] = useCallback(
      (list: T[]) => {
        if (filter === null || filter === undefined) return list;
        if (
          Object.prototype.hasOwnProperty.call(filter, "search") &&
          !_.isEmpty(filter["search"])
        ) {
          const fieldKeys = fieldCombineSearch
            ? fieldCombineSearch
            : ["name", "code"];
          return sortList(combineFilterList(list, fieldKeys));
        }
        return sortList(filterList(list));
      },
      [filter, fieldCombineSearch, sortList, combineFilterList, filterList]
    );

    useEffect(() => {
      if (autoCallByChange) {
        const filteredList = handleFilter(contentValue);
        dispatch({
          type: ListActionType.SET,
          payload: {
            list: filteredList,
            count: filteredList.length,
          },
        });
        return;
      } else {
        if (invokeChange) {
          const filteredList = handleFilter(contentValue);
          dispatch({
            type: ListActionType.SET,
            payload: {
              list: filteredList,
              count: filteredList.length,
            },
          });
          setInvokeChange(false);
        }
        return;
      }
    }, [contentValue, invokeChange, handleFilter, autoCallByChange]);

    return {
      list,
      count,
      invokeChange,
      handleInvokeChange,
    };
  },

  useFilterList<T extends Model, TFilter extends ModelFilter>(filter: TFilter) {
    const getLodashOrder = (orderType: any) => {
      if (orderType === OrderType.ASC) return "asc";
      if (orderType === OrderType.DESC) return "desc";
      return "desc";
    };

    // sortData by sortType and sortOrder
    const sortList = useCallback(
      (list: T[]) => {
        return _.chain(list)
          .orderBy(filter.orderBy, getLodashOrder(filter.orderType))
          .drop(filter?.skip ? filter.skip : 0)
          .take(filter?.take ? filter.take : DEFAULT_TAKE) //take
          .value();
      },
      [filter]
    );

    const filterList = useCallback(
      (list: T[]) => {
        Object.entries(filter).forEach(([fKey, fType]) => {
          // IdFilter
          if (fType instanceof IdFilter) {
            Object.entries(fType).forEach(([fTypeKey, fValue]) => {
              switch (fTypeKey) {
                case "equal":
                  list = list.filter((i: T) => {
                    const iValue: number = i[fKey] as number;
                    if (
                      typeof iValue === "number" &&
                      typeof fValue === "number"
                    ) {
                      return iValue === fValue;
                    }
                    return false;
                  });
                  break;
                case "notEqual":
                  list = list.filter((i: T) => {
                    const iValue: number = i[fKey] as number;
                    if (
                      typeof iValue === "number" &&
                      typeof fValue === "number"
                    ) {
                      return iValue !== fValue;
                    }
                    return false;
                  });
                  break;
                case "in":
                  list = list.filter((i: T) => {
                    const iValue: number = i[fKey] as number;
                    if (typeof iValue === "number" && Array.isArray(fValue)) {
                      return fValue.includes(iValue);
                    }
                    return false;
                  });
                  break;
                case "notIn":
                  list = list.filter((i: T) => {
                    const iValue: number = i[fKey] as number;
                    if (typeof iValue === "number" && Array.isArray(fValue)) {
                      return !fValue.includes(iValue);
                    }
                    return false;
                  });
                  break;
                default:
                  break;
              }
            });
          }

          // NumberFilter
          if (fType instanceof NumberFilter) {
            Object.entries(fType).forEach(([fTypeKey, fValue]) => {
              if (typeof fValue === "number") {
                switch (fTypeKey) {
                  case "equal":
                    list = list.filter((i: T) => {
                      const iValue: number = i[fKey] as number;
                      if (typeof iValue === "number") {
                        return iValue === fValue;
                      }
                      return false;
                    });
                    break;
                  case "notEqual":
                    list = list.filter((i: T) => {
                      const iValue: number = i[fKey] as number;
                      if (typeof iValue === "number") {
                        return iValue !== fValue;
                      }
                      return false;
                    });
                    break;
                  case "less":
                    list = list.filter((i: T) => {
                      const iValue: number = i[fKey] as number;
                      if (typeof iValue === "number") {
                        return iValue < fValue;
                      }
                      return false;
                    });
                    break;
                  case "lessEqual":
                    list = list.filter((i: T) => {
                      const iValue: number = i[fKey] as number;
                      if (typeof iValue === "number") {
                        return iValue <= fValue;
                      }
                      return false;
                    });
                    break;
                  case "greater":
                    list = list.filter((i: T) => {
                      const iValue: number = i[fKey] as number;
                      if (typeof iValue === "number") {
                        return iValue > fValue;
                      }
                      return false;
                    });
                    break;
                  case "greaterEqual":
                    list = list.filter((i: T) => {
                      const iValue: number = i[fKey] as number;
                      if (typeof iValue === "number") {
                        return iValue >= fValue;
                      }
                      return false;
                    });
                    break;
                  default:
                    break;
                }
              }
            });
          }

          // StringFilter
          if (fType instanceof StringFilter) {
            Object.entries(fType).forEach(([fTypeKey, fValue]) => {
              if (typeof fValue === "string") {
                switch (fTypeKey) {
                  case "equal":
                    list = list.filter((i: T) => {
                      const iValue: string = i[fKey];
                      if (typeof iValue === "string") {
                        return iValue === fValue;
                      }
                      return false;
                    });
                    break;
                  case "notEqual":
                    list = list.filter((i: T) => {
                      const iValue: string = i[fKey];
                      if (typeof iValue === "string") {
                        return iValue !== fValue;
                      }
                      return false;
                    });
                    break;
                  case "contain":
                    list = list.filter((i: T) => {
                      const iValue: string = i[fKey];
                      if (typeof iValue === "string") {
                        return iValue.indexOf(fValue) >= 0;
                      }
                      return false;
                    });
                    break;
                  case "notContain":
                    list = list.filter((i: T) => {
                      const iValue: string = i[fKey];
                      if (typeof iValue === "string") {
                        return iValue.indexOf(fValue) < 0;
                      }
                      return false;
                    });
                    break;
                  case "startWith":
                    list = list.filter((i: T) => {
                      const iValue: string = i[fKey];
                      if (typeof iValue === "string") {
                        return iValue.startsWith(fValue);
                      }
                      return false;
                    });
                    break;
                  case "notStartWith":
                    list = list.filter((i: T) => {
                      const iValue: string = i[fKey];
                      if (typeof iValue === "string") {
                        return !iValue.startsWith(fValue);
                      }
                      return false;
                    });
                    break;
                  case "endWith":
                    list = list.filter((i: T) => {
                      const iValue: string = i[fKey];
                      if (typeof iValue === "string") {
                        return iValue.endsWith(fValue);
                      }
                      return false;
                    });
                    break;
                  case "notEndWith":
                    list = list.filter((i: T) => {
                      const iValue: string = i[fKey];
                      if (typeof iValue === "string") {
                        return !iValue.endsWith(fValue);
                      }
                      return false;
                    });
                    break;
                  default:
                    break;
                }
              }
            });
          }

          // DateFilter
          // Convert item value and filter value into Moment-based time first
          if (fType instanceof DateFilter) {
            Object.entries(fType).forEach(([fTypeKey, fValue]) => {
              if (typeof fValue === "object" && fValue !== null) {
                switch (fTypeKey) {
                  case "equal":
                    list = list.filter((i: T) => {
                      const iValue: number = (i[fKey] as Moment)
                        ?.toDate()
                        .getTime();
                      const fMoment: number = (fValue as Moment)
                        ?.toDate()
                        .getTime();
                      if (
                        typeof iValue === "number" &&
                        typeof fMoment == "number"
                      ) {
                        return iValue === fMoment;
                      }
                      return false;
                    });
                    break;
                  case "notEqual":
                    list = list.filter((i: T) => {
                      const iValue: number = (i[fKey] as Moment)
                        ?.toDate()
                        .getTime();
                      const fMoment: number = (fValue as Moment)
                        ?.toDate()
                        .getTime();
                      if (
                        typeof iValue === "number" &&
                        typeof fMoment == "number"
                      ) {
                        return iValue !== fMoment;
                      }
                      return false;
                    });
                    break;
                  case "less":
                    list = list.filter((i: T) => {
                      const iValue: number = (i[fKey] as Moment)
                        ?.toDate()
                        .getTime();
                      const fMoment: number = (fValue as Moment)
                        ?.toDate()
                        .getTime();
                      if (
                        typeof iValue === "number" &&
                        typeof fMoment == "number"
                      ) {
                        return iValue < fMoment;
                      }
                      return false;
                    });
                    break;
                  case "lessEqual":
                    list = list.filter((i: T) => {
                      const iValue: number = (i[fKey] as Moment)
                        ?.toDate()
                        .getTime();
                      const fMoment: number = (fValue as Moment)
                        ?.toDate()
                        .getTime();
                      if (
                        typeof iValue === "number" &&
                        typeof fMoment == "number"
                      ) {
                        return iValue <= fMoment;
                      }
                      return false;
                    });
                    break;
                  case "greater":
                    list = list.filter((i: T) => {
                      const iValue: number = (i[fKey] as Moment)
                        ?.toDate()
                        .getTime();
                      const fMoment: number = (fValue as Moment)
                        ?.toDate()
                        .getTime();
                      if (
                        typeof iValue === "number" &&
                        typeof fMoment == "number"
                      ) {
                        return iValue > fMoment;
                      }
                      return false;
                    });
                    break;
                  case "greaterEqual":
                    list = list.filter((i: T) => {
                      const iValue: number = (i[fKey] as Moment)
                        ?.toDate()
                        .getTime();
                      const fMoment: number = (fValue as Moment)
                        ?.toDate()
                        .getTime();
                      if (
                        typeof iValue === "number" &&
                        typeof fMoment == "number"
                      ) {
                        return iValue >= fMoment;
                      }
                      return false;
                    });
                    break;
                  default:
                    break;
                }
              }
            });
          }
        });
        return list;
      },
      [filter]
    );

    const combineFilterList = useCallback(
      (list: T[], fieldKeys: string[]) => {
        const filterValue = { ...filter };
        const listValue = _.cloneDeep(list).map((currentItem: any) => {
          currentItem["rowKey"] = uuidv4();
          return currentItem;
        });
        const tempList: T[] = [];
        const searchValue: StringFilter = filterValue["search"];
        fieldKeys.forEach((fieldKey: string) => {
          Object.entries(searchValue).forEach(([key, value]) => {
            var listFiltered: T[];
            switch (key) {
              case "equal":
                if (typeof value === "string") {
                  listFiltered = listValue.filter((currentItem) => {
                    let valueKey = currentItem[fieldKey]["equal"] as string;
                    return valueKey === value;
                  });
                  if (listFiltered && listFiltered.length > 0)
                    tempList.push(...listFiltered);
                }
                break;
              case "contain":
                if (typeof value === "string") {
                  listFiltered = listValue.filter((currentItem) => {
                    let valueKey = currentItem[fieldKey]["contain"] as string;
                    return valueKey.includes(value);
                  })[0];
                  if (listFiltered && listFiltered.length > 0)
                    tempList.push(...listFiltered);
                }
                break;
              case "notEqual":
                if (typeof value === "string") {
                  listFiltered = listValue.filter((currentItem) => {
                    let valueKey = currentItem[fieldKey]["notEqual"] as string;
                    return valueKey !== value;
                  })[0];
                  if (listFiltered && listFiltered.length > 0)
                    tempList.push(...listFiltered);
                }
                break;
              case "notContain":
                if (typeof value === "string") {
                  listFiltered = listValue.filter((currentItem) => {
                    let valueKey = currentItem[fieldKey][
                      "notContain"
                    ] as string;
                    return !valueKey.includes(value);
                  })[0];
                  if (listFiltered && listFiltered.length > 0)
                    tempList.push(...listFiltered);
                }
                break;
              case "startWith":
                if (typeof value === "string") {
                  listFiltered = listValue.filter((currentItem) => {
                    let valueKey = currentItem[fieldKey]["endWith"] as string;
                    return valueKey.startsWith(value);
                  })[0];
                  if (listFiltered && listFiltered.length > 0)
                    tempList.push(...listFiltered);
                }
                break;
              case "endWith":
                if (typeof value === "string") {
                  listFiltered = listValue.filter((currentItem) => {
                    let valueKey = currentItem[fieldKey]["endWith"] as string;
                    return valueKey.endsWith(value);
                  })[0];
                  if (listFiltered && listFiltered.length > 0)
                    tempList.push(...listFiltered);
                }
                break;
              case "notStartWith":
                if (typeof value === "string") {
                  listFiltered = listValue.filter((currentItem) => {
                    let valueKey = currentItem[fieldKey]["endWith"] as string;
                    return !valueKey.startsWith(value);
                  })[0];
                  if (listFiltered && listFiltered.length > 0)
                    tempList.push(...listFiltered);
                }
                break;
              case "notEndWith":
                if (typeof value === "string") {
                  listFiltered = listValue.filter((currentItem) => {
                    let valueKey = currentItem[fieldKey]["endWith"] as string;
                    return !valueKey.endsWith(value);
                  })[0];
                  if (listFiltered && listFiltered.length > 0)
                    tempList.push(...listFiltered);
                }
                break;
            }
          });
        });
        if (tempList && tempList.length > 1) {
          tempList.reduce((acc, current) => {
            const x = acc.find((item: any) => item.rowKey === current.rowKey);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
        }
        return tempList;
      },
      [filter]
    );

    return {
      sortList,
      filterList,
      combineFilterList,
    };
  },
};
