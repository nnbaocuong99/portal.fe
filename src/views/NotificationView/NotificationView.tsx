import React, { useState, useCallback } from "react";
import { Spin } from "antd";
// import "./UserNotificationView.scss";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { buildAbsoluteLink } from "helpers/string";
import { formatDateTime } from "helpers/date-time";
import {
  UserNotificationFilter,
  UserNotification,
} from "models/UserNotification";
import { userNotificationRepository } from "repositories/user-notification-repository";
import { webService } from "services/web-service";
import { finalize, forkJoin } from "rxjs";
import InputSearch from "react3l-ui-library/build/components/Input/InputSearch";
import PageHeader from "components/PageHeader/PageHeader";
import { AdvanceEnumFilterMaster } from "react3l-ui-library";
import { Status, StatusFilter } from "models/Status";
import notificationStyle from "./NotificationView.module.scss";
import classNames from "classnames";

function NotificationView() {
  const [translate] = useTranslation();
  const {
    notifications,
    loadingNotification,
    handleReadNotifications,
    handleInfiniteOnLoad,
    hasMore,
    total,
    notificationFilter,
    handleChangeStatusFilter,
  } = useUserNotification();
  const listFilterType: any[] = React.useMemo(() => {
    return [
      {
        id: 1,
        name: translate("notifications.read"),
      },
      {
        id: 2,
        name: translate("notifications.unRead"),
      },
      {
        id: 3,
        name: translate("notifications.all"),
      },
    ];
  }, [translate]);
  return (
    <Spin spinning={loadingNotification}>
      <div className="page-content">
        <PageHeader
          title={translate("notifications.master.subHeader")}
          breadcrumbItems={[
            translate("notifications.master.header"),
            translate("notifications.master.subHeader"),
          ]}
        />

        <div
          className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs"
          style={{ height: "75vh" }}
        >
          <div className="page-master__content">
            <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
              <div className="page-master__filter d-flex align-items-center justify-content-start">
                <div className="">
                  <AdvanceEnumFilterMaster
                    value={
                      notificationFilter["unread"] === undefined
                        ? 3
                        : notificationFilter["unread"]
                        ? 2
                        : 1
                    }
                    listItem={listFilterType}
                    onChange={handleChangeStatusFilter()}
                    title={translate("notifications.status")}
                  />
                </div>
              </div>
              <div className="page-master__filter-action-search d-flex align-items-center">
                <InputSearch
                  valueFilter={notificationFilter}
                  classFilter={StatusFilter}
                  placeHolder={translate("general.placeholder.search")}
                  onChange={handleChangeStatusFilter}
                />
              </div>
            </div>
          </div>
          {notifications.length > 0 && (
            <div
              className="infinite-container"
              style={{
                height: "600px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <InfiniteScroll
                hasMore={hasMore}
                height={500}
                dataLength={notifications.length}
                next={handleInfiniteOnLoad}
                loader={loadingNotification && notifications.length > 5}
              >
                {notifications.map((userNotification) => (
                  <Link
                    key={userNotification.id}
                    to="#"
                    onClick={handleReadNotifications(
                      userNotification.id,
                      userNotification.linkWebsite
                        ? `${buildAbsoluteLink(userNotification.linkWebsite)}`
                        : "#"
                    )}
                  >
                    <div
                      className={classNames(
                        `${notificationStyle["notification-wrapper"]} m-b--sm d-flex`,
                        {
                          "unread-noti": userNotification.unread === true,
                        }
                      )}
                      key={userNotification?.id}
                    >
                      <div
                        className={`${notificationStyle["notification-box-icon-wrapper"]} m-l--xxs`}
                      >
                        <div
                          className={`${notificationStyle["notification-box-icon"]}`}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_5569_24364)">
                              <path
                                d="M9.34108 12.5818C9.34108 13.8873 8.28279 14.9455 6.97737 14.9455C5.67195 14.9455 4.61377 13.8873 4.61377 12.5818C4.61377 11.2764 5.67195 10.2181 6.97737 10.2181C8.28279 10.2181 9.34108 11.2764 9.34108 12.5818Z"
                                fill="#22215B"
                              />
                              <path
                                d="M11.1185 7.80791C9.11531 7.52183 7.5684 5.79931 7.5684 3.71822C7.5684 3.12723 7.69477 2.56655 7.91874 2.05769C7.61622 1.98682 7.3019 1.94549 6.97741 1.94549C4.69659 1.94549 2.84109 3.80088 2.84109 6.08182V7.72925C2.84109 8.89866 2.32877 10.0025 1.42996 10.7624C1.20015 10.9585 1.06836 11.2452 1.06836 11.5477C1.06836 12.118 1.53221 12.5819 2.10241 12.5819H11.8524C12.4227 12.5819 12.8866 12.118 12.8866 11.5477C12.8866 11.2452 12.7548 10.9585 12.519 10.7571C11.6468 10.0191 11.141 8.94768 11.1185 7.80791Z"
                                fill="#22215B"
                              />
                              <path
                                d="M14.6593 3.71822C14.6593 5.34996 13.3364 6.67269 11.7047 6.67269C10.073 6.67269 8.75012 5.34996 8.75012 3.71822C8.75012 2.08647 10.073 0.763634 11.7047 0.763634C13.3364 0.763634 14.6593 2.08647 14.6593 3.71822Z"
                                fill="#4CE364"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_5569_24364">
                                <rect
                                  width="14.1818"
                                  height="14.1818"
                                  fill="white"
                                  transform="translate(0.763672 0.763634)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>

                      <div
                        className={`${notificationStyle["notification-box-text"]} m-t--xs p-l--xs`}
                      >
                        <div className={`d-flex justify-content-between`}>
                          <div
                            className={`${notificationStyle["notification-box-header-left"]} d-flex`}
                          >
                            <div
                              className={`${notificationStyle["notification-box-title"]} text-truncate`}
                            >
                              {userNotification.titleWeb}
                            </div>
                            {userNotification?.unread ? (
                              <div
                                className={`${notificationStyle["notification-box-status-wrapper"]} p-l--xxxs`}
                              >
                                <div
                                  className={`${notificationStyle["notification-box-status"]}`}
                                ></div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          <div
                            className={`${notificationStyle["notification-box-time"]} p-r--xs`}
                          >
                            {formatDateTime(userNotification.time)}
                          </div>
                        </div>
                        <div
                          className={`${notificationStyle["notification-box-content"]} text-truncate`}
                        >
                          {userNotification.contentWeb}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {!hasMore && (
                  <div
                    className="d-flex justify-content-center p-2"
                    style={{ background: "#e8e8e8", fontSize: 12 }}
                  >
                    {translate("general.notification.listAllLeft")}
                    <b>&nbsp;{total}&nbsp;</b>
                    {translate("general.notification.listAllRight")}
                  </div>
                )}
              </InfiniteScroll>
            </div>
          )}
          {loadingNotification && (
            <div
              className="d-flex justify-content-center"
              style={{ width: "100%" }}
            >
              <div className="loading-container">
                <Spin spinning={loadingNotification} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
}

function useUserNotification() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [subscription] = webService.useSubscription();
  const [total, setTotal] = useState<number>(0);
  const [fetchAllNotification, setFetchAllNotification] =
    useState<boolean>(true);
  const [loadingNotification, setLoadingNotification] =
    useState<boolean>(false);
  const [notificationFilter, setNotificationFilter] =
    useState<UserNotificationFilter>({
      ...new UserNotificationFilter(),
    });
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleGetData = React.useCallback(
    (filter: UserNotificationFilter) => {
      setNotificationFilter(filter);
      subscription.add(
        forkJoin([
          userNotificationRepository.list(filter),
          userNotificationRepository.count(filter),
        ])
          .pipe(finalize(() => setLoadingNotification(false)))
          .subscribe((results: [UserNotification[], number]) => {
            setNotifications(results[0]);
            setTotal(results[1]);
          })
      );
    },
    [subscription]
  );

  React.useEffect(() => {
    if (fetchAllNotification) {
      handleGetData({
        ...new UserNotificationFilter(),
        skip: 0,
        take: 10,
      });
      setFetchAllNotification(false);
    }
  }, [fetchAllNotification, handleGetData]);

  const handleChangeStatusFilter = React.useCallback(
    () => (idValue: number, value: Status) => {
      const tempFilter = { ...notificationFilter };
      tempFilter["skip"] = 0;
      tempFilter["take"] = 10;
      tempFilter[`statusValue`] = value;
      if (idValue === 1) {
        tempFilter["unread"] = false;
      } else if (idValue === 2) tempFilter["unread"] = true;
      else tempFilter["unread"] = undefined;
      handleGetData(tempFilter);
      setHasMore(true);
    },
    [handleGetData, notificationFilter]
  );

  const handleReadNotifications = useCallback((id: number, url: string) => {
    // some async request here
    return async (ev: any) => {
      ev.preventDefault();
      await userNotificationRepository.read(id);
      window.location.href = url;
    };
  }, []);

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
      await userNotificationRepository
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
  }, [notificationFilter, total, notifications]);

  return {
    notifications,
    loadingNotification,
    handleReadNotifications,
    handleInfiniteOnLoad,
    total,
    hasMore,
    notificationFilter,
    setNotificationFilter,
    handleChangeStatusFilter,
  };
}

export default NotificationView;
