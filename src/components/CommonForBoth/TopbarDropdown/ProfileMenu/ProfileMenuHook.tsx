import React from "react";
import authenticationService from "services/authentication-service";
import { Model } from "react3l-common";
import {
  APP_USER_DETAIL_ROUTE,
  APP_USER_MASTER_ROUTE,
} from "config/route-consts";

export class Site extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public icon?: string;
}

export class AppUserSiteMapping extends Model {
  public appUserId?: number;
  public siteId?: number;
  public enabled?: boolean;
  public site?: Site;
}

export function useProfileMenu() {
  const user = JSON.parse(localStorage.getItem("currentUserInfo"));

  const [profileDrop, setProfileDrop] = React.useState(false);
  const handleLogout = React.useCallback(() => {
    authenticationService.logout();
  }, []);
  const handleClickToProfile = React.useCallback(() => {
    window.location.href = `${APP_USER_DETAIL_ROUTE}?id=${user?.id}`;
  }, [user?.id]);
  const handleClickToChangePassword = React.useCallback(() => {
    window.location.href = `${APP_USER_MASTER_ROUTE}?idChangePassword=${user?.id}`;
  }, [user?.id]);

  const handleToggerProfile = React.useCallback(() => {
    setProfileDrop(!profileDrop);
  }, [profileDrop]);

  const handleMouseLeaveAll = React.useCallback(() => {
    setProfileDrop(false);
  }, []);

  return {
    user,
    handleLogout,
    handleClickToChangePassword,
    handleToggerProfile,
    profileDrop,
    handleMouseLeaveAll,
    handleClickToProfile,
  };
}
