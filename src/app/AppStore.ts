import { Menu } from "config/menu";
import { Model } from "react3l-common";

/**
 *
 * Contain AppState and reducer
 *
 * */
export interface AppState {
  isLoggedIn?: boolean;
  isSuccess?: boolean;
  successMessage?: boolean;
  isError?: boolean;
  errorMessage?: string;
  loading?: boolean;
  isErrorModalVisible?: boolean; // use it just one time for appModal
  toggleMenu?: boolean;
  displayFooter?: boolean;
  displayOverlay?: boolean;
  extendPageMaster?: boolean;
  user?: Model;
  isCheckingAuth?: boolean;
  permissionPaths?: string[];
  authorizedMenus?: Menu[];
  authorizedAction?: string[];
  authorizedMenuMapper?: Record<string, any>;
}

export interface AppAction {
  type: AppActionEnum;
  data?: AppState;
  isLoggedIn?: boolean;
  isSuccess?: boolean;
  successMessage?: boolean;
  isError?: boolean;
  errorMessage?: string;
  loading?: boolean;
  isErrorModalVisible?: boolean; // use it just one time for appModal
  toggleMenu?: boolean;
  displayFooter?: boolean;
  displayOverlay?: boolean;
  user?: Model;
  isCheckingAuth?: boolean;
  extendPageMaster?: boolean;
  permissionPaths?: string[];
  authorizedMenus?: Menu[];
  authorizedAction?: string[];
  authorizedMenuMapper?: Record<string, any>;
}

export enum AppActionEnum {
  INIT_IMPORT,
  IMPORT_SUCCESS,
  IMPORT_ERROR,
  END_IMPORT,
  SET_FOOTER,
  SET_OVERLAY,
  CLOSE_ERROR_MODAL,
  SET_MENU,
  LOG_IN,
  LOG_OUT,
  EXTEND_PAGE,
  SET_PERMISSION
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionEnum.INIT_IMPORT: {
      return {
        ...state,
        loading: true,
      };
    }
    case AppActionEnum.IMPORT_ERROR: {
      return {
        ...state,
        errorMessage: action.errorMessage,
        isErrorModalVisible: true,
      };
    }
    case AppActionEnum.END_IMPORT: {
      return {
        ...state,
        loading: false,
      };
    }
    case AppActionEnum.SET_FOOTER: {
      return {
        ...state,
        displayFooter: action.displayFooter,
      };
    }
    case AppActionEnum.SET_OVERLAY: {
      return {
        ...state,
        displayOverlay: action.displayOverlay,
      };
    }
    case AppActionEnum.SET_MENU: {
      return {
        ...state,
        toggleMenu: action.toggleMenu,
      };
    }
    case AppActionEnum.CLOSE_ERROR_MODAL: {
      return {
        ...state,
        isErrorModalVisible: false,
      };
    }
    case AppActionEnum.LOG_IN: {
      return {
        ...state,
        isLoggedIn: true,
        isCheckingAuth: false,
        user: action.user,
      };
    }
    case AppActionEnum.LOG_OUT: {
      return {
        ...state,
        isLoggedIn: false,
        user: undefined,
      };
    }
    case AppActionEnum.EXTEND_PAGE: {
      return {
        ...state,
        extendPageMaster: action.extendPageMaster,
      };
    }
    case AppActionEnum.SET_PERMISSION: {
      return {
        ...state,
        permissionPaths: action.permissionPaths,
        authorizedMenus: action.authorizedMenus,
        authorizedAction: action.authorizedAction,
        authorizedMenuMapper: action.authorizedMenuMapper
      };
    }
  }
}
