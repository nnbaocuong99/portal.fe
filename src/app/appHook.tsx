import { LOGIN_ROUTE } from "config/route-consts";
import { Reducer, useCallback, useEffect, useReducer } from "react";
import { Model } from "react3l-common";
import { Subscription } from "rxjs";
import appMessageService, { messageType } from "services/app-message-service";
import authenticationService from "services/authentication-service";
import { webService } from "services/web-service";
import { AppAction, AppActionEnum, appReducer, AppState } from "./AppStore";

export default function useApp() {
  const [subscription] = webService.useSubscription();
  // reducer
  const [state, dispatch] = useReducer<Reducer<AppState, AppAction>>(
    appReducer,
    {
      isLoggedIn: false,
      isSuccess: false,
      successMessage: false,
      isError: false,
      errorMessage: "",
      loading: false,
      isErrorModalVisible: false,
      toggleMenu: false,
      displayFooter: false,
      displayOverlay: false,
      extendPageMaster: false,
      user: undefined,
      isCheckingAuth: true,
    }
  );

  const {
    isLoggedIn,
    isSuccess,
    successMessage,
    isError,
    errorMessage,
    loading,
    isErrorModalVisible,
    toggleMenu,
    displayFooter,
    displayOverlay,
  } = state;

  const currentPath = `${LOGIN_ROUTE}?redirect=${window.location.pathname}`;

  useEffect(() => {
    const subscription = new Subscription();
    subscription.add(
      authenticationService.checkAuth().subscribe((result: Model) => {
        if (result) {
          dispatch({ type: AppActionEnum.LOG_IN, user: result });
        } else {
          window.location.href = currentPath;
        }
      })
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [currentPath]);

  useEffect(() => {
    const successSubscription: Subscription = appMessageService
      ._success()
      .subscribe(
        appMessageService.handleNotify({
          type: messageType.SUCCESS,
          title: "thanh cong",
        })
      ); // subscribe success

    const errorSubscription: Subscription = appMessageService
      ._error()
      .subscribe(
        appMessageService.handleNotify({
          type: messageType.ERROR,
          title: "that bai",
        })
      ); // subscribe error

    subscription.add(successSubscription);
    subscription.add(errorSubscription);
  }, [subscription]); // subcribe appMessageService

  const handleToggleOverlay = useCallback(() => {
    dispatch({
      type: AppActionEnum.SET_OVERLAY,
      displayOverlay: !displayOverlay,
    });
  }, [displayOverlay]); // handle turn off overlay

  const handleCloseErrorModal = useCallback(() => {
    dispatch({ type: AppActionEnum.CLOSE_ERROR_MODAL });
  }, []); // handle close error modal

  return {
    isLoggedIn,
    isSuccess,
    successMessage,
    isError,
    errorMessage,
    loading,
    isErrorModalVisible,
    toggleMenu,
    displayFooter,
    displayOverlay,
    handleToggleOverlay,
    handleCloseErrorModal,
    dispatch,
    appMessageService, // service instance
    state,
  };
}
