import { Moment } from "moment";
import { Dispatch, useMemo, useCallback } from "react";
import { Model } from "react3l-common";
import { ModelAction, ModelActionEnum } from "./detail-service";
import memoize from "fast-memoize";
import { ValidationField } from "./validation-service";
import * as yup from "yup";

interface ConfigField {
  fieldName: string | [string, string];
  validator?: ValidationField;
}

export const fieldService = {
  /**
   *
   * react hook for handle actions to change form field
   * @param: model: T
   * @param: dispatch: Dispatch<ModelAction<T>>
   *
   * @return: { value,
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeListField,
      handleChangeAllField, }
   *
   * */
  useField<T extends Model>(model: T, dispatch: Dispatch<ModelAction<T>>) {
    const value = useMemo(() => model, [model]);

    /** Handler for validate value in another handle action
     */
    const handleValidateField = useCallback(
      (validator: ValidationField, fieldName: string, value: unknown) => {
        if (validator && validator.isValidator && validator.schema) {
          if (validator.path) {
            try {
              const schemaField: yup.InferType<any> = yup.reach(
                validator.schema,
                validator.path
              );
              const result = schemaField.validateSync(value);
              if (result instanceof yup.ValidationError) {
                const errorMessage = result.errors.join(", ");
                dispatch({
                  type: ModelActionEnum.UPDATE_ERRORS,
                  payload: {
                    [fieldName as string]: errorMessage,
                  },
                });
                return false;
              }
            } catch (error: any) {
              return true;
            }
          } else {
            const result = validator.schema.validateSync(value);
            if (result instanceof yup.ValidationError) {
              const errors = result.inner.reduce((acc, error) => {
                return {
                  ...acc,
                  [error.path]: error.errors.join(", "),
                };
              }, {});
              dispatch({
                type: ModelActionEnum.UPDATE_ERRORS,
                payload: {
                  ...errors,
                },
              });
            }
          }
        }
        return true;
      },
      [dispatch]
    );

    /** Handler for changing a single field in field
     */
    const handleChangeSingleField = useMemo(
      () =>
        memoize((config: ConfigField) => (value: any) => {
          const { fieldName, validator } = config;
          const isValid = handleValidateField(
            validator,
            fieldName as string,
            value
          );
          if (isValid) {
            dispatch({
              type: ModelActionEnum.UPDATE,
              payload: {
                [fieldName as string]: value,
              } as T,
            });
          }
        }),
      [dispatch, handleValidateField]
    );

    /**
      Handler specifically used for Select component 
    */
    const handleChangeSelectField = useMemo(
      () =>
        memoize((config: ConfigField) => (idValue: number, value: Model) => {
          const { fieldName, validator } = config;
          const isValid = handleValidateField(
            validator,
            `${fieldName}Id`,
            value
          );
          if (isValid) {
            dispatch({
              type: ModelActionEnum.UPDATE,
              payload: {
                [fieldName as string]: value,
                [`${fieldName}Id`]: idValue,
              } as T,
            });
          }
        }),
      [dispatch, handleValidateField]
    );

    /**
      Handler specifically used for MultipleSelect component 
    */
    const handleChangeMultipleSelectField = useMemo(
      () =>
        memoize((config: ConfigField) => (values: Model[]) => {
          const { fieldName, validator } = config;
          const isValid = handleValidateField(
            validator,
            `${fieldName}Id`,
            values
          );
          if (values && isValid) {
            const listIds =
              values.length > 0 ? values.map((current) => current.id) : [];
            dispatch({
              type: ModelActionEnum.UPDATE,
              payload: {
                [fieldName as string]: [...values],
                [`${fieldName}Id`]: [...listIds],
              } as T,
            });
          }
        }),
      [dispatch, handleValidateField]
    );

    /**
      Handler specifically used for Date component 
    */
    const handleChangeDateField = useMemo(
      () =>
        memoize((config: ConfigField) => (date: Moment | [Moment, Moment]) => {
          const { fieldName, validator } = config;
          if (date instanceof Array && fieldName instanceof Array) {
            dispatch({
              type: ModelActionEnum.UPDATE,
              payload: {
                [fieldName[0]]: date[0],
                [fieldName[1]]: date[1],
              } as T,
            });
          } else {
            const isValid = handleValidateField(
              validator,
              fieldName as string,
              date
            );
            if (isValid) {
              dispatch({
                type: ModelActionEnum.UPDATE,
                payload: {
                  [fieldName as string]: date,
                } as T,
              });
            }
          }
        }),
      [dispatch, handleValidateField]
    );

    /**
      Handler to overwrite the whole field
    */

    const handleChangeTreeField = useMemo(
      () =>
        memoize(
          (config: ConfigField) => (values: any[], isMultiple: boolean) => {
            const { fieldName, validator } = config;
            const isValid = handleValidateField(
              validator,
              fieldName as string,
              values
            );
            if (isValid) {
              if (isMultiple) {
                dispatch({
                  type: ModelActionEnum.UPDATE,
                  payload: {
                    [fieldName as string]: [...values],
                  } as T,
                });
              } else {
                dispatch({
                  type: ModelActionEnum.UPDATE,
                  payload: {
                    [fieldName as string]: [...values][0],
                    [`${fieldName}Id`]: [...values][0]?.id,
                  } as T,
                });
              }
            }
          }
        ),
      [dispatch, handleValidateField]
    );

    /**
      Handler to change table content data
    */
    const handleChangeListField = useMemo(
      () =>
        memoize((config: ConfigField) => (data: any[] = []) => {
          const { fieldName } = config;
          dispatch({
            type: ModelActionEnum.UPDATE,
            payload: {
              [fieldName as string]: [...data],
            } as T,
          });
        }),
      [dispatch]
    );

    /**
      Handler to overwrite the whole field
    */
    const handleChangeAllField = useCallback(
      (data: Model) => {
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
      handleChangeListField,
      handleChangeAllField,
    };
  },
};
