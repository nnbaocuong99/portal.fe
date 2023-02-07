import { Moment } from "moment";
import { Dispatch, useMemo, useCallback } from "react";
import { Model } from "react3l-common";
import { ModelAction, ModelActionEnum } from "./detail-service";

export const fieldService = {
  useField<T extends Model>(model: T, dispatch: Dispatch<ModelAction<T>>) {
    const value = useMemo(() => model, [model]);

    /** Handler for changing a single field in field
     */
    const handleChangeSingleField = useCallback(
      (config: { fieldName: string }) => (value: any) => {
        const { fieldName } = config;
        dispatch({
          type: ModelActionEnum.UPDATE,
          payload: {
            [fieldName]: value,
          } as T,
        });
      },
      [dispatch]
    );

    /**
      Handler specifically used for Select component 
    */
    const handleChangeSelectField = useCallback(
      (config: { fieldName: string }) => (idValue: number, value: Model) => {
        const { fieldName } = config;
        dispatch({
          type: ModelActionEnum.UPDATE,
          payload: {
            [fieldName]: value,
            [`${fieldName}Id`]: idValue,
          } as T,
        });
      },
      [dispatch]
    );

    const handleChangeMultipleSelectField = useCallback(
      (config: { fieldName: string }) => (values: Model[]) => {
        const { fieldName } = config;
        if (values) {
          const listIds =
            values.length > 0 ? values.map((current) => current.id) : [];
          dispatch({
            type: ModelActionEnum.UPDATE,
            payload: {
              [fieldName]: [...values],
              [`${fieldName}Id`]: [...listIds],
            } as T,
          });
        }
      },
      [dispatch]
    );

    /**
      Handler specifically used for Date component 
    */
    const handleChangeDateField = useCallback(
      (config: { fieldName: string | [string, string] }) =>
        (date: Moment | [Moment, Moment]) => {
          const { fieldName } = config;
          if (date instanceof Array && fieldName instanceof Array) {
            dispatch({
              type: ModelActionEnum.UPDATE,
              payload: {
                [fieldName[0]]: date[0],
                [fieldName[1]]: date[1],
              } as T,
            });
          } else {
            dispatch({
              type: ModelActionEnum.UPDATE,
              payload: {
                [fieldName as string]: date,
              } as T,
            });
          }
        },
      [dispatch]
    );

    /**
      Handler to overwrite the whole field
    */

    const handleChangeTreeField = useCallback(
      (config: { fieldName: string }) =>
        (values: any[], isMultiple: boolean) => {
          const { fieldName } = config;
          if (isMultiple) {
            dispatch({
              type: ModelActionEnum.UPDATE,
              payload: {
                [fieldName]: [...values],
              } as T,
            });
          } else {
            dispatch({
              type: ModelActionEnum.UPDATE,
              payload: {
                [fieldName]: [...values][0],
                [`${fieldName}Id`]: [...values][0]?.id,
              } as T,
            });
          }
        },
      [dispatch]
    );

    /**
      Handler to change table content data
    */
    const handleChangeContentField = useCallback(
      (config: { fieldName: string }) =>
        (data: any[] = []) => {
          const { fieldName } = config;
          dispatch({
            type: ModelActionEnum.UPDATE,
            payload: {
              [fieldName]: [...data],
            } as T,
          });
        },
      [dispatch]
    );

    /**
      Handler to overwrite the whole field
    */
    const handleChangeAllField = useCallback(
      (data: any) => {
        dispatch({
          type: ModelActionEnum.SET,
          payload: data,
        });
      },
      [dispatch]
    );

    return {
      value,
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeContentField,
      handleChangeAllField,
    };
  },
};
