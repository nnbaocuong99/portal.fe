import {
  APP_USER_DETAIL_ROUTE,
  APP_USER_MASTER_ROUTE,
  USER_NOTIFICATION_ROUTE,
} from "config/route-consts";
import { DEFAULT_TAKE } from "config/consts";
import { debounce } from "helpers/debounce";
import { buildAbsoluteLink } from "helpers/string";
import { notification } from "helpers/notification";
import { AppUser } from "models/AppUser";
import { AppUserSiteMapping } from "models/AppUserSiteMapping";
import { UserNotification } from "models/UserNotification";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownItem, DropdownMenu } from "reactstrap";
import authenticationService from "services/authentication-service";
import { SignalRService } from "services/signalr-service";
import "./DefaultHeader.scss";
import userNotificationRepository from "./UserNotificationRepository";
import { Notification24 } from "@carbon/icons-react";
import { UserNotificationFilter } from "models/UserNotification";
export default function useDefaultHeader(
  user: AppUser,
  service: any,
  channel: any,
  unreadAll: any
) {
  const currentUserInfo = JSON.parse(localStorage.getItem("currentUserInfo"));
  const [translate] = useTranslation();

  const [visibleApp, setVisibleApp] = useState<boolean>(false);

  const [total, setTotal] = useState<number>(0);

  const [visibleNotification, setVisibleNotification] =
    useState<boolean>(false);

  const [visibleMenuAction, setVisibleMenuAction] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  const [notificationFilter, setNotificationFilter] =
    useState<UserNotificationFilter>(new UserNotificationFilter());

  const [fetchNotification, setFetchNotification] = useState<boolean>(false);

  const [loadingNotification, setLoadingNotification] =
    useState<boolean>(false);

  const [unreadNotification, dispatchNotification] = useReducer(
    newNotificationReducer,
    0
  );

  const [subcribe, setSubcribe] = useState<boolean>(true);

  const fetchUnreadNotification = useCallback(async () => {
    try {
      const total = await userNotificationRepository.countUnread(
        notificationFilter
      );
      await dispatchNotification({ type: COUNT_UNREAD, payload: { total } });
    } catch (ex) {
      // tslint:disable-next-line:no-console
      console.log(`ex:`, ex);
    }
  }, [notificationFilter]);

  /* subcribe channel */
  const subcribeChannel = useCallback(
    (signalRService: SignalRService, channel: string) => {
      return signalRService.registerChannel(
        channel,
        (data: UserNotification) => {
          // dispatch count unread
          fetchUnreadNotification();
          // fire toast to notice new notification
          notification.open(notificationConfig(data));
        }
      );
    },
    [fetchUnreadNotification]
  );

  useEffect(() => {
    fetchUnreadNotification();
  }, [fetchUnreadNotification]);

  /* refactor subcribe channel */
  useEffect(() => {
    if (subcribe) {
      subcribeChannel(service, channel);
      setSubcribe(false);
    }
  }, [channel, service, subcribe, subcribeChannel]);

  const [hasMore, setHasMore] = useState<boolean>(true);
  useEffect(() => {
    const cancelled = false;
    if (fetchNotification) {
      const fetchData = async () => {
        await setLoadingNotification(true);
        const data = await userNotificationRepository.list(notificationFilter);
        const count = await userNotificationRepository.count(
          notificationFilter
        );
        if (!cancelled) {
          await setNotifications([...data]);
          await setTotal(count);
        }
        await setFetchNotification(false);
        await setLoadingNotification(false);
      };
      fetchData();
    }
  }, [fetchNotification, notificationFilter]);

  /* handleToggerNotification */
  const handleToggleNotification = useCallback(() => {
    /* if notification is closing, set fetch data = true */
    if (!visibleNotification) {
      setNotificationFilter({
        ...notificationFilter,
        skip: 0,
        take: DEFAULT_TAKE,
      });
      setHasMore(true);
      setFetchNotification(true);
    }
    setNotifications([]);
    setVisibleNotification(!visibleNotification);
  }, [notificationFilter, visibleNotification]);

  const handleToggleMenuAction = useCallback(() => {
    /* if notification is closing, set fetch data = true */

    setVisibleMenuAction(!visibleMenuAction);
  }, [setVisibleMenuAction, visibleMenuAction]);

  /* handleInfiniteOnLoad */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInfiniteOnLoad = useCallback(
    debounce(() => {
      if (notificationFilter.skip + 10 >= total) {
        setLoadingNotification(false);
        setHasMore(false);
        return;
      }
      /* fetch notification with effect */
      const fetch = async () => {
        await setLoadingNotification(true);
        const data = await userNotificationRepository.list({
          ...notificationFilter,
          skip: notificationFilter.skip + 10,
        });
        await setNotifications([...notifications, ...data]);
        await setNotificationFilter({
          ...notificationFilter,
          skip: notificationFilter.skip + 10,
        });
        await setLoadingNotification(false);
      };
      fetch();
    }),
    [total, notificationFilter, notifications]
  );

  const codeLanding = "/landing/";

  const handleClick = React.useCallback(
    (project: string) => {
      return () => {
        // ev.preventDefault();
        if (
          user &&
          user.appUserSiteMappings &&
          user.appUserSiteMappings.length > 0
        ) {
          user.appUserSiteMappings.map((item: AppUserSiteMapping) => {
            if (item.site.code === project) {
              window.location.href = `${item.site.code}`;
            }
            return window.location.href;
          });
          return;
        }
      };
    },
    [user]
  );

  const handleShowApp = React.useCallback(() => {
    setVisibleApp(!visibleApp);
  }, [visibleApp]);

  const handleClickToProfile = React.useCallback(() => {
    window.location.href = `${APP_USER_DETAIL_ROUTE}?id=${currentUserInfo?.id}`;
  }, [currentUserInfo?.id]);
  const handleClickToChangePassword = React.useCallback(() => {
    window.location.href = `${APP_USER_MASTER_ROUTE}?idChangePassword=${currentUserInfo?.id}`;
  }, [currentUserInfo?.id]);

  const handleClickToNotification = React.useCallback(() => {
    window.location.href = USER_NOTIFICATION_ROUTE;
  }, []);

  const handleLogout = React.useCallback(() => {
    authenticationService.logout();
  }, []);

  const menu = (
    <DropdownMenu className="menu-dropdown">
      <DropdownItem key="1" className="display-name">
        <div className="background d-flex align-items-center ml-1">
          {user?.avatar && (
            <img className="display-avatar m-r--sm" src={user?.avatar} alt="" />
          )}
          <div className="name m-r--md">{user?.username}</div>
          <div className="notification">
            {unreadAll} {translate("general.notification.title")}
          </div>
        </div>
      </DropdownItem>
      <DropdownItem key="2" onClick={handleClickToProfile}>
        <div className="d-flex align-items-center mt-2 mb-1">
          <div className="">
            <img
              className="display-avatar mr-3"
              src="/assets/icons/user-drop.svg"
              alt=""
            />
          </div>
          <div>
            <div className="text-top">
              {translate("general.defaultHeader.profile")}
            </div>
            <div className="text-setup">
              {translate("general.defaultHeader.setupProfile")}
            </div>
          </div>
        </div>
      </DropdownItem>
      {/* <Menu.Divider /> */}
      <DropdownItem key="3" onClick={handleClickToChangePassword}>
        <div className="d-flex align-items-center mt-1 mb-1">
          <div className="">
            <img
              className="display-avatar mr-3"
              src="/assets/icons/user-lock.svg"
              alt=""
            />
          </div>
          <div>
            <div className="text-top">
              {translate("general.defaultHeader.changePass")}
            </div>
            <div className="text-setup">
              {translate("general.defaultHeader.setupChangePass")}
            </div>
          </div>
        </div>
      </DropdownItem>
      {/* <Menu.Divider /> */}
      <DropdownItem key="4" onClick={handleLogout}>
        <div className="btn-logout">
          <span>{translate("general.defaultHeader.logout")}</span>
        </div>
      </DropdownItem>
    </DropdownMenu>
  );

  const handleReadNotification = useCallback(
    (id: number, url: string) => {
      return async (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        ev.preventDefault();
        await userNotificationRepository.read(id);
        await fetchUnreadNotification();
        window.location.href = url;
      };
    },
    [fetchUnreadNotification]
  );

  return {
    handleClickToProfile,
    handleClickToChangePassword,
    handleLogout,
    setVisibleNotification,
    visibleNotification,
    handleShowApp,
    handleClickToNotification,
    handleToggleNotification,
    visibleApp,
    setVisibleApp,
    menu,
    handleClick,
    codeLanding,
    subcribeChannel,
    loadingNotification,
    notifications,
    handleInfiniteOnLoad,
    hasMore,
    total,
    handleReadNotification,
    unreadNotification,
    visibleMenuAction,
    handleToggleMenuAction,
  };
}

const notificationConfig = (data: UserNotification) => ({
  message: (
    <div
      className="content-noti-ellipsis"
      dangerouslySetInnerHTML={{
        __html: data.titleWeb,
      }}
    ></div>
  ),
  description: (
    <div
      className="content-noti-ellipsis"
      dangerouslySetInnerHTML={{
        __html: data.contentWeb,
      }}
    ></div>
  ),
  icon: <Notification24 />,
  onClick: async () => {
    await userNotificationRepository.read(data.id);
    setTimeout(() => {
      window.location.href = data.linkWebsite
        ? buildAbsoluteLink(data.linkWebsite)
        : "#";
    }, 0);
  },
});

export const COUNT_UNREAD = "COUNT_UNREAD";

function newNotificationReducer(state: number, action: any) {
  switch (action.type) {
    case "COUNT_UNREAD": {
      return action.payload.total;
    }
    default:
      return state;
  }
}
