import { DEFAULT_TAKE } from "config/consts";

import { AppUser, AppUserFilter } from "models/AppUser";
import React, { Reducer, useEffect } from "react";
import authenticationService from "services/authentication-service";
import notification from "antd/lib/notification";
import { Model, ModelFilter } from "react3l-common";
import { userNotificationRepository } from "repositories/user-notification-repository";
import {
  APP_USER_DETAIL_ROUTE,
  APP_USER_MASTER_ROUTE,
  USER_NOTIFICATION_ROUTE,
} from "config/route-consts";
import { SignalRService } from "services/signalr-service";
import { Notification24 } from "@carbon/icons-react";
import { useHistory } from "react-router";
import { Observable } from "rxjs";

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

interface RepoState {
  list: (TModelFilter?: Model) => Observable<ModelFilter[]>;
  count: (TModelFilter?: Model) => Observable<number>;
}
interface RepoAction {
  type: string;
  data: RepoState;
}
function repositoryReducer(state: RepoState, action: RepoAction) {
  switch (action.type) {
    case "UPDATE":
      return { ...action.data };
    default:
      return { ...state };
  }
}

export function useNotificationDropdown(service: any, channel: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("currentUserInfo"));
  const [notificationDropDown, setNotificationDropDown] = React.useState(false);

  const [notificationFilter, setNotificationFilter] =
    React.useState<AppUserFilter>(new AppUserFilter());
  const [notifications, setNotifications] = React.useState<AppUser[]>([]);

  const [fetchNotification, setFetchNotification] =
    React.useState<boolean>(false);
  const [loadingNotification, setLoadingNotification] =
    React.useState<boolean>(false);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [profileDrop, setProfileDrop] = React.useState(false);
  const [subcribe, setSubcribe] = React.useState<boolean>(true);
  const [showUnread, setShowUnread] = React.useState<boolean>(false);

  const [total, setTotal] = React.useState<number>(0);
  const [unreadNotification, setUnreadNotification] = React.useState<number>(0);

  const initRepo = React.useMemo(() => {
    return {
      list: userNotificationRepository.list,
      count: userNotificationRepository.count,
    };
  }, []);

  const [repo, dispatch] = React.useReducer<Reducer<RepoState, RepoAction>>(
    repositoryReducer,
    initRepo
  );

  const notificationConfig = (data: any) => {
    return notification.success({
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
          history.push(data.linkWebsite);
        }, 0);
      },
    });
  };

  const fetchData = React.useCallback(async () => {
    await setLoadingNotification(true);

    await repo.list(notificationFilter).subscribe((res: any) => {
      setNotifications([...res]);
    });

    await repo.count(notificationFilter).subscribe((res: any) => {
      setTotal(res);
      if (res <= DEFAULT_TAKE) {
        setHasMore(false);
      }
    });

    await setFetchNotification(false);
    await setLoadingNotification(false);
  }, [repo, notificationFilter]);

  useEffect(() => {
    if (fetchNotification) {
      fetchData();
    }
  }, [fetchNotification, fetchData]);

  const fetchUnreadNotification = React.useCallback(async () => {
    try {
      const notificationFilter__fetchUnreadNotification = new AppUserFilter();
      await userNotificationRepository
        .countUnread(notificationFilter__fetchUnreadNotification)
        .subscribe((res: any) => {
          setUnreadNotification(res);
        });
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(`ex:`, ex);
    }
  }, []);

  const fetchReadNotification = React.useCallback(async (id) => {
    try {
      await userNotificationRepository.read(id).subscribe((_res: any) => {});
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(`ex:`, ex);
    }
  }, []);

  const subcribeChannel = React.useCallback(
    (signalRService: SignalRService, channel: string) => {
      return signalRService.registerChannel(channel, (data: any) => {
        fetchUnreadNotification();
        // fire toast to notice new notification
        notificationConfig(data);
      });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchUnreadNotification();
  }, [fetchUnreadNotification]);

  useEffect(() => {
    if (subcribe) {
      subcribeChannel(service, channel);
      setSubcribe(false);
    }
  }, [channel, service, subcribe, subcribeChannel]);

  const handleLogout = React.useCallback(() => {
    authenticationService.logout();
  }, []);
  const handleClickToNotification = React.useCallback(() => {
    window.location.href = USER_NOTIFICATION_ROUTE;
  }, []);
  const handleClickToProfile = React.useCallback(() => {
    window.location.href = `${APP_USER_DETAIL_ROUTE}?id=${user?.id}`;
  }, [user?.id]);
  const handleClickToChangePassword = React.useCallback(() => {
    window.location.href = `${APP_USER_MASTER_ROUTE}?idChangePassword=${user?.id}`;
  }, [user?.id]);

  /* handleToggerNotification */
  const handleToggleNotification = React.useCallback(() => {
    /* if notification is closing, set fetch data = true */
    if (!notificationDropDown) {
      setNotificationFilter({
        ...notificationFilter,
        skip: 0,
        take: DEFAULT_TAKE,
      });
      setHasMore(true);
      setFetchNotification(true);
    }
    // setNotifications([]);
    setNotificationDropDown(!notificationDropDown);
  }, [notificationDropDown, notificationFilter]);

  /* handleInfiniteOnLoad */
  const handleInfiniteOnLoad = React.useCallback(() => {
    if (notificationFilter.skip + 10 >= total) {
      setLoadingNotification(false);
      setHasMore(false);
      return;
    }

    /* fetch notification with effect */
    const fetch = async () => {
      await setLoadingNotification(true);

      await repo
        .list({
          ...notificationFilter,
          skip: notificationFilter.skip + 10,
        })
        .subscribe((res: any) => {
          setNotifications([...notifications, ...res]);
        });
      await setNotificationFilter({
        ...notificationFilter,
        skip: notificationFilter.skip + 10,
      });

      await setLoadingNotification(false);
    };
    fetch();
  }, [repo, total, notificationFilter, notifications]);

  const handleToggerProfile = React.useCallback(() => {
    setProfileDrop(!profileDrop);
  }, [profileDrop]);

  useEffect(() => {
    if (!notificationDropDown) {
      setShowUnread(false);
      dispatch({
        type: "UPDATE",
        data: {
          list: userNotificationRepository.list,
          count: userNotificationRepository.count,
        },
      });
    }
  }, [notificationDropDown]);

  const handleMouseLeaveAll = React.useCallback(() => {
    // setNotificationDropDown(false);
    // setProfileDrop(false);
  }, []);

  const handleReadNotification = React.useCallback(
    (id: number, url: string) => {
      return async () => {
        // ev.preventDefault();
        await fetchReadNotification(id);
        await fetchUnreadNotification();
        history.push(url);
      };
    },
    [fetchReadNotification, fetchUnreadNotification, history]
  );

  const handleMouseEnterNotification = (notification: any) => {
    notification.isHover = true;
    setNotifications([...notifications]);
  };

  const handleMouseLeaveNotification = (notification: any) => {
    notification.isHover = false;
    setNotifications([...notifications]);
  };

  const handleUnReadNotification = (event: any, notification: any) => {
    event.stopPropagation();
    userNotificationRepository.unread(notification.id).subscribe((res) => {
      notification.unread = true;
      setNotifications([...notifications]);
      fetchUnreadNotification();
    });
  };

  const handleClickReadAllNotification = () => {
    userNotificationRepository.readAll().subscribe((res) => {
      notifications.forEach((element: any) => {
        element.unread = false;
      });
      setNotifications([...notifications]);
      setUnreadNotification(0);
    });
  };

  const handleChangeUnreadSwitch = React.useCallback(
    async (event: any) => {
      setShowUnread(event);
      if (event) {
        setNotificationFilter({
          ...notificationFilter,
          skip: 0,
          take: DEFAULT_TAKE,
        });
        setHasMore(true);

        dispatch({
          type: "UPDATE",
          data: {
            list: userNotificationRepository.listUnread,
            count: userNotificationRepository.countUnread,
          },
        });

        setFetchNotification(true);
      } else {
        setNotificationFilter({
          ...notificationFilter,
          skip: 0,
          take: DEFAULT_TAKE,
        });
        setHasMore(true);

        dispatch({
          type: "UPDATE",
          data: {
            list: userNotificationRepository.list,
            count: userNotificationRepository.count,
          },
        });

        setFetchNotification(true);
      }
    },
    [notificationFilter]
  );

  return {
    showUnread,
    handleLogout,
    handleClickToNotification,
    handleToggleNotification,
    handleClickToChangePassword,
    notificationDropDown,
    notifications,
    hasMore,
    total,
    loadingNotification,
    handleInfiniteOnLoad,
    handleToggerProfile,
    profileDrop,
    handleMouseLeaveAll,
    handleReadNotification,
    unreadNotification,
    handleClickToProfile,
    handleMouseEnterNotification,
    handleMouseLeaveNotification,
    handleUnReadNotification,
    handleClickReadAllNotification,
    handleChangeUnreadSwitch,
  };
}
