import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Model } from "react3l-common";
import { finalize, Observable } from "rxjs";
import { webService } from "./web-service";
import { queryStringService } from "./query-string-service";
import appMessageService from "./app-message-service";
import { AxiosError } from "axios";
import { fieldService } from "./field-service";
import { useHistory } from "react-router";

export enum ModelActionEnum {
  SET,
  UPDATE,
}

export interface ModelAction<T extends Model> {
  type: ModelActionEnum;
  payload: T;
}

const createModelReducer =
  <T extends Model>() =>
  (state: T, action: ModelAction<T>) => {
    switch (action.type) {
      case ModelActionEnum.SET:
        return { ...action.payload };
      case ModelActionEnum.UPDATE:
        return { ...state, ...action.payload };
      default:
        return { ...state };
    }
  };

export const detailService = {
  useModel<T extends Model>(ModelClass: new () => T, initData?: T) {
    const modelReducer = createModelReducer<T>();
    const [model, dispatch] = useReducer(
      modelReducer,
      initData ? initData : new ModelClass()
    );

    return {
      model,
      dispatch,
    };
  },

  useGetIsDetail<T extends Model>(
    getDetail: (id: number | string) => Observable<T>,
    dispatch: React.Dispatch<ModelAction<Model>>
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
  useContentList<T extends Model, TContent extends Model>(
    model: T,
    setModel: (model: T) => void,
    contentField: string
  ) {
    const content: TContent[] = useMemo(() => {
      if (model) {
        if (typeof model[contentField] === "undefined") return null;
        if (model[contentField]?.length === 0) return [];
        if (model[contentField]?.length > 0) {
          return model[contentField].map((item: any, index: number) => {
            if (typeof item.key !== "undefined") {
              return { ...item };
            }
            return { ...item, key: index }; // assign key for each content item
          });
        }
      }
    }, [contentField, model]);

    const setContent = useCallback(
      (v: TContent[]) => {
        setModel({ ...model, [contentField]: v });
      },
      [contentField, setModel, model]
    );

    return { content, setContent };
  },

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
