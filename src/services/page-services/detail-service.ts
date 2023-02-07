import {
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { Model } from "react3l-common";
import { finalize, Observable } from "rxjs";
import { webService } from "../common-services/web-service";
import { queryStringService } from "./query-string-service";
import appMessageService from "../common-services/app-message-service";
import { AxiosError } from "axios";
import { fieldService } from "./field-service";
import { useHistory } from "react-router";
import { ValidationError } from "./validation-service";
import { utilService } from "services/common-services/util-service";

export enum ModelActionEnum {
  SET,
  UPDATE,
  SET_ERRORS,
  UPDATE_ERRORS,
}

export interface ModelAction<T extends Model> {
  type: ModelActionEnum;
  payload: T | ValidationError;
}

function modelReducer<T extends Model>(state: T, action: ModelAction<T>): T {
  switch (action.type) {
    case ModelActionEnum.SET:
      return { ...(action.payload as T) };
    case ModelActionEnum.UPDATE:
      return { ...state, ...(action.payload as T) };
    case ModelActionEnum.SET_ERRORS: {
      let errors: ValidationError = {};
      let errorArrays: ValidationError = {};
      if (!utilService.isEmpty(action.payload)) {
        Object.keys(action.payload as ValidationError).forEach(
          (key: string) => {
            if (
              action.payload[key] &&
              typeof action.payload[key] === "string"
            ) {
              errors[key] = action.payload[key];
            } else {
              errorArrays[key] = action.payload[key];
            }
          }
        );
        if (!utilService.isEmpty(errorArrays)) {
          Object.keys(errorArrays).forEach((key: string) => {
            const contents: any[] = state[key] || [];
            const values = errorArrays[key];
            Object.keys(values).forEach((key: string) => {
              const indexNumber = Number(key);
              if (contents[indexNumber]) {
                contents[indexNumber]["errors"] = { ...values[key] };
              } else {
                contents[indexNumber] = {};
                contents[indexNumber]["errors"] = { ...values[key] };
              }
            });
          });
        }
      }
      return { ...state, errors };
    }
    case ModelActionEnum.UPDATE_ERRORS:
      if (action.payload && !utilService.isEmpty(action.payload)) {
        state["errors"] = {
          ...state["errors"],
          ...(action.payload as ValidationError),
        };
      }
      return { ...state };
    default:
      return { ...state };
  }
}

export const detailService = {
  /**
   *
   * react hook for manage state of model
   * @param: ModelClass: new () => T
   * @param: initData: T
   *
   * @return: { model, dispatch }
   *
   * */
  useModel<T extends Model>(ModelClass: new () => T, initData?: T) {
    const [model, dispatch] = useReducer<Reducer<T, ModelAction<T>>>(
      modelReducer,
      initData ? initData : new ModelClass()
    );

    return {
      model,
      dispatch,
    };
  },

  /**
   *
   * react hook for check detail page and set detail data
   * @param: getDetail:(id: number | string) => Observable<T>
   * @param: dispatch: React.Dispatch<ModelAction<T>>
   *
   * @return: { isDetail }
   *
   * */
  useGetIsDetail<T extends Model>(
    getDetail: (id: number | string) => Observable<T>,
    dispatch: React.Dispatch<ModelAction<T>>
  ) {
    const { id }: any = queryStringService.useGetQueryString("id");
    const isDetail = useMemo(() => id !== null, [id]);
    const [subscription] = webService.useSubscription();

    useEffect(() => {
      if (isDetail) {
        subscription.add(
          getDetail(id).subscribe({
            next: (res) =>
              dispatch({ type: ModelActionEnum.SET, payload: res }),
            error: (_err) => {},
          })
        );
      }
    }, [dispatch, getDetail, id, isDetail, subscription]);

    return { isDetail };
  },

  /**
   *
   * react hook for handle actions in detail page
   * @param: model: T
   * @param: saveModel: (t: T) => Observable<T>
   *
   * @return: { loading, setLoading, handleSaveModel, handleGoMaster }
   *
   * */
  useActionsDetail<T extends Model>(
    model: T,
    saveModel: (t: T) => Observable<T>,
    handleChangeAllField: (data: any) => void,
    routeView: string
  ) {
    const history = useHistory();

    const baseRoute = useMemo(() => {
      let listPath = routeView.split("/");
      const baseRoute = "/" + listPath[listPath.length - 1];
      return baseRoute;
    }, [routeView]);

    const [loading, setLoading] = useState<boolean>(false);
    const [subscription] = webService.useSubscription();
    const { notifyUpdateItemSuccess, notifyUpdateItemError } =
      appMessageService.useCRUDMessage();

    const handleGoMaster = useCallback(() => {
      history.replace(`${routeView}${baseRoute}-master`);
    }, [routeView, baseRoute, history]);

    const handleSaveModel = useCallback(() => {
      setLoading(true);
      subscription.add(
        saveModel(model)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: (item: T) => {
              handleChangeAllField(item); // setModel
              notifyUpdateItemSuccess();
              handleGoMaster(); // go master
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError();
            },
          })
      );
    }, [
      handleChangeAllField,
      handleGoMaster,
      model,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      saveModel,
      subscription,
    ]);
    return { loading, setLoading, handleSaveModel, handleGoMaster };
  },

  /**
   *
   * react hook for handle logic in detail modal page
   * @param: ModelClass: new () => T
   * @param: getDetail: (id: number) => Observable<T>
   * @param: saveModel: (t: Model) => Observable<T>
   * @param: saveModel: handleSeach?: () => void
   * 
   * @return: { model,
      dispatch,
      isOpenDetailModal,
      loadingModel,
      handleOpenDetailModal,
      handleSaveModel,
      handleCloseDetailModal,
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeAllField }
   *
   * */
  useDetailModal<T extends Model>(
    ModelClass: new () => T,
    getDetail: (id: number) => Observable<T>,
    saveModel: (t: Model) => Observable<T>,
    handleSeach?: () => void
  ) {
    const { notifyUpdateItemSuccess, notifyUpdateItemError } =
      appMessageService.useCRUDMessage();

    const [subscription] = webService.useSubscription();

    const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
    const [loadingModel, setLoadingModel] = useState<boolean>(false);
    const { model, dispatch } = this.useModel(ModelClass);
    const {
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeAllField,
    } = fieldService.useField(model, dispatch);

    const handleOpenDetailModal = useCallback(
      (id?: number) => {
        setIsOpenDetailModal(true);
        if (id) {
          setLoadingModel(true);
          subscription.add(
            getDetail(id)
              .pipe(finalize(() => setLoadingModel(false)))
              .subscribe((item: T) => {
                handleChangeAllField(item);
              })
          );
        } else {
          handleChangeAllField(new ModelClass());
        }
      },
      [getDetail, handleChangeAllField, subscription, ModelClass]
    );

    const handleSaveModel = useCallback(() => {
      setLoadingModel(true);
      subscription.add(
        saveModel(model)
          .pipe(finalize(() => setLoadingModel(false)))
          .subscribe({
            next: (item: T) => {
              handleChangeAllField(item);
              setIsOpenDetailModal(false);
              if (typeof handleSeach === "function") handleSeach();
              notifyUpdateItemSuccess({
                message: "Cập nhật thành công",
                className: "antd-notification-drawer",
              });
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError({
                message: "Cập nhật thất bại",
                className: "antd-notification-drawer",
              });
            },
          })
      );
    }, [
      saveModel,
      subscription,
      handleSeach,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      handleChangeAllField,
      model,
    ]);

    const handleCloseDetailModal = useCallback(() => {
      setIsOpenDetailModal(false);
      if (model.id) handleChangeAllField({ ...model });
      else handleChangeAllField({ ...new ModelClass() });
    }, [ModelClass, handleChangeAllField, model]);

    return {
      model,
      dispatch,
      isOpenDetailModal,
      loadingModel,
      handleOpenDetailModal,
      handleSaveModel,
      handleCloseDetailModal,
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeAllField,
    };
  },
};
