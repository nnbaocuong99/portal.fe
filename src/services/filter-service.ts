import { Moment } from "moment";
import React, { Dispatch, SetStateAction, useMemo, useReducer } from "react";
import {
  DateFilter, GuidFilter, IdFilter, NumberFilter, StringFilter
} from "react3l-advanced-filters";
import { Model, ModelFilter } from "react3l-common";
import { Observable } from "rxjs";

export enum FilterActionEnum {
  SET,
  UPDATE,
  UPDATE_PAGINATION,
}

export interface FilterAction<TFilter> {
  type: FilterActionEnum;
  payload?: TFilter;
}

export function filterReducer<TFilter extends ModelFilter>(
  state: TFilter,
  action: FilterAction<TFilter>
) {
  switch (action.type) {
    case FilterActionEnum.SET:
      return {
        ...action.payload,
      };
    case FilterActionEnum.UPDATE:
      return {
        ...state,
        ...action.payload,
      };
    case FilterActionEnum.UPDATE_PAGINATION:
      return {
        ...state,
        skip: action.payload?.skip,
        take: action.payload?.take,
      };
  }
}

export const filterService = {
  /**
    Returns current modelfilter value and dispatch action,
  */
  useModelFilter<T extends ModelFilter>(
    ModelFilterClass: new () => T,
    initData?: T
  ) {
    const [modelFilter, dispatchFilter] = useReducer(
      filterReducer,
      initData ? initData : new ModelFilterClass()
    );

    return {
      modelFilter,
      dispatchFilter,
    };
  },

  /**
    Returns current filter value and 3 handlers for changing it,
  */
  useFilter<TFilter extends ModelFilter>(
    modelFilter: TFilter,
    dispatch: (action: FilterAction<TFilter>) => void
  ) {
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, []);
    const value = useMemo(() => modelFilter, [modelFilter]);

    // Handler for changing a single field in filter
    const handleChangeInputFilter = React.useCallback(
      (config: {
        fieldName: string;
        fieldType: string;
        classFilter: new (partial?: any) => StringFilter | NumberFilter;
      }) =>
        (newValue?: string | number | null) => {
          const { fieldName, fieldType, classFilter: ClassFilter } = config;
          if (typeof newValue === "string") {
            newValue = newValue.trim();
          }
          dispatch({
            type: FilterActionEnum.UPDATE,
            payload: {
              [fieldName]: new ClassFilter({
                [fieldType]: newValue,
              }),
              skip: 0,
            } as TFilter,
          });
          handleSearch()
        },
      [dispatch, handleSearch]
    );

    /**
      Handler specifically used for Select component 
    */
    const handleChangeSelectFilter = React.useCallback(
      (config: {
        fieldName: string;
        fieldType: string;
        classFilter: new (partial?: any) => IdFilter | GuidFilter;
      }) =>
        (idValue: number, value: Model) => {
          const { fieldName, fieldType, classFilter: ClassFilter } = config;
          dispatch({
            type: FilterActionEnum.UPDATE,
            payload: {
              [`${fieldName}Value`]: value,
              [`${fieldName}Id`]: Object.assign(new ClassFilter(), {
                [fieldType]: idValue,
              }),
              skip: 0,
            } as TFilter,
          });
          handleSearch();
        },
      [dispatch, handleSearch]
    );

    /**
      Handler specifically used for Multiple Select component 
    */
    const handleChangeMultipleSelectFilter = React.useCallback(
      (config: {
        fieldName: string;
        fieldType: string;
        classFilter: new (partial?: any) => IdFilter | GuidFilter;
      }) =>
        (values: Model[]) => {
          const { fieldName, fieldType, classFilter: ClassFilter } = config;
          if (values) {
            const listIds =
              values.length > 0 ? values.map((current) => current.id) : [];
            dispatch({
              type: FilterActionEnum.UPDATE,
              payload: {
                [`${fieldName}Value`]: [...values],
                [`${fieldName}Id`]: new ClassFilter({
                  [fieldType]: [...listIds],
                }),
                skip: 0,
              } as TFilter,
            });
          }
          handleSearch();
        },
      [dispatch, handleSearch]
    );

    /**
      Handler specifically used for Date component 
    */
    const handleChangeDateFilter = React.useCallback(
      (config: { fieldName: string; fieldType: string | [string, string] }) =>
        (date: Moment | [Moment, Moment]) => {
          const { fieldName, fieldType } = config;
          if (date instanceof Array && fieldType instanceof Array) {
            dispatch({
              type: FilterActionEnum.UPDATE,
              payload: {
                [fieldName]: new DateFilter({
                  [fieldType[0]]: date[0],
                  [fieldType[1]]: date[1],
                }),
                skip: 0,
              } as TFilter,
            });
          } else {
            dispatch({
              type: FilterActionEnum.UPDATE,
              payload: {
                [fieldName]: new DateFilter({
                  [fieldType as string]: date,
                }),
                skip: 0,
              } as TFilter,
            });
          }
          handleSearch();
        },
      [dispatch, handleSearch]
    );

    /**
      Handler specifically used for Date component 
    */
    const handleChangeDateMasterFilter = React.useCallback(
      (config: { fieldName: string; fieldType: [string, string] }) =>
        (item: any, dates: any) => {
          const { fieldName, fieldType } = config;
          dispatch({
            type: FilterActionEnum.UPDATE,
            payload: {
              [`${fieldName}Selected`]: { ...item },
              [fieldName]: dates && dates.length > 0 ? new DateFilter({
                [fieldType[0]]: dates[0],
                [fieldType[1]]: dates[1],
              }) : new DateFilter(),
              skip: 0,
            } as TFilter,
          });
        },
      [dispatch]
    );
    /**
      Handler to overwrite the whole filter
    */
    const handleChangeAllFilter = React.useCallback(
      (data: any) => {
        dispatch({
          type: FilterActionEnum.SET,
          payload: data,
        });
        handleSearch();
      },
      [dispatch, handleSearch]
    );

    /**
      Handler specifically used for Multiple Select component 
    */
    const handleChangeSingleTreeFilter = React.useCallback(
      (config: {
        fieldName: string;
        fieldType: string;
        classFilter: new (partial?: any) => IdFilter | GuidFilter;
      }) =>
        (values?: Model[]) => {
          const { fieldName, fieldType, classFilter: ClassFilter } = config;
          if (values) {
            const id =
              values.length > 0
                ? values.length === 1
                  ? values[0]?.id
                  : values.map((current) => current?.id)
                : undefined;
            dispatch({
              type: FilterActionEnum.UPDATE,
              payload: {
                [`${fieldName}Value`]: values?.length > 0 && values[0],
                [`${fieldName}Id`]: new ClassFilter({
                  [fieldType]: id,
                }),
                skip: 0,
              } as TFilter,
            });
          }
        },
      [dispatch]
    );

    const handleResetFilter = React.useCallback(
      (config: { classFilter: new (partial?: any) => TFilter }) => {
        const { classFilter: ClassFilter } = config;
        const newFilter = new ClassFilter();
        newFilter.skip = 0;
        newFilter.take = 10;
        dispatch({
          type: FilterActionEnum.SET,
          payload: newFilter,
        });
        handleSearch();
      },
      [dispatch, handleSearch]
    );
    // Handler for changing input search
    const handleChangeInputSearch = React.useCallback(
      (value: string) => {
        dispatch({
          type: FilterActionEnum.UPDATE,
          payload: {
            search: value,
            skip: 0,
          } as any
        });
        handleSearch()
      },
      [dispatch, handleSearch]
    );

    return {
      value,
      loadList,
      setLoadList,
      handleSearch,
      handleResetFilter,
      handleChangeInputFilter,
      handleChangeSelectFilter,
      handleChangeMultipleSelectFilter,
      handleChangeDateFilter,
      handleChangeDateMasterFilter,
      handleChangeAllFilter,
      handleChangeSingleTreeFilter,
      handleChangeInputSearch,
    };
  },

  useEnumList<T extends Model>(
    handleList: () => Observable<T[]>
  ): [T[], Dispatch<SetStateAction<T[]>>] {
    const [list, setList] = React.useState<T[]>([]);

    React.useEffect(() => {
      handleList().subscribe((list: T[]) => {
        setList(list);
      });
    }, [handleList]);

    return [list, setList];
  },
};
