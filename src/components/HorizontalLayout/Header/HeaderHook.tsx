import React from "react";
import { Model } from "react3l-common";
import { AppState } from "app/AppStore";

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

export function useHeaderHook(state?: AppState) {
  const [gatewayDropDown, setGatewayDropDown] = React.useState(false);
  const handleToggerGateway = React.useCallback(() => {
    setGatewayDropDown(!gatewayDropDown);
  }, [gatewayDropDown]);
  const handleClick = React.useCallback(
    (project: string) => {
      return () => {
        // ev.preventDefault();
        if (
          state?.user &&
          state?.user.appUserSiteMappings &&
          state?.user.appUserSiteMappings.length > 0
        ) {
          state?.user.appUserSiteMappings.map((item: AppUserSiteMapping) => {
            if (item.site.code === project) {
              window.location.href = `${item.site.code}`;
            }
            return window.location.href;
          });
          return;
        }
      };
    },
    [state?.user]
  );

  return {
    handleToggerGateway,
    gatewayDropDown,
    handleClick,
  };
}
