import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { useNotificationDropdown } from "./NotificationDropdownHook";
import { SignalRContext } from "app/AppContext";
//i18n
import { useTranslation, withTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatDateTimeFromNow } from "helpers/date-time";
import classNames from "classnames";
import "./NotificationDropdown.scss";
import { Switch } from "antd";
import { Email24, EmailNew16, Launch16 } from "@carbon/icons-react";
import "moment/locale/vi";
import { buildAbsoluteLink } from "helpers/string";
import { Button } from "react3l-ui-library";

export const SIGNALR_CHANNEL: string = "Receive";

const NotificationDropdown = (props: any) => {
  const [translate] = useTranslation();

  const signalRContext = useContext(SignalRContext);
  const {
    showUnread,
    handleToggleNotification,
    notificationDropDown,
    notifications,
    hasMore,
    total,
    loadingNotification,
    handleClickToNotification,
    handleInfiniteOnLoad,
    handleMouseLeaveAll,
    handleReadNotification,
    unreadNotification,
    handleMouseEnterNotification,
    handleMouseLeaveNotification,
    handleUnReadNotification,
    handleClickReadAllNotification,
    handleChangeUnreadSwitch,
  } = useNotificationDropdown(signalRContext, SIGNALR_CHANNEL);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={notificationDropDown}
        toggle={handleToggleNotification}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn btn-48 header-item noti-icon"
          tag="button"
          id="page-header-notifications-dropdown"
          onClick={handleToggleNotification}
        >
          <i className="bx bx-bell bx-tada" />
          <span className="badge bg-danger rounded-pill">
            {unreadNotification}
          </span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu notification-dropdown-menu">
          <div
            className={`notification-dropdown on-click-show-div ${
              notificationDropDown ? "active" : ""
            }`}
            onMouseLeave={handleMouseLeaveAll}
          >
            <>
              <div className="notification-header-title p-l--xs d-flex align-items-center justify-content-between">
                {translate("general.notification.title")}
                <div>
                  <span style={{ fontWeight: 400 }}>
                    {translate("general.notification.unread")}
                  </span>
                  <Switch
                    checked={showUnread}
                    style={{
                      marginLeft: "8px",
                      marginRight: "16px",
                    }}
                    size="small"
                    onChange={handleChangeUnreadSwitch}
                  />
                </div>
              </div>
              <hr style={{ margin: 0 }} />
              <div className="notifications-content">
                <InfiniteScroll
                  dataLength={notifications.length}
                  next={handleInfiniteOnLoad}
                  hasMore={true}
                  height={500}
                  loader={loadingNotification && notifications.length > 5}
                >
                  {
                    <div className="notifications d-flex flex-column align-item-center">
                      {notifications &&
                        notifications?.length > 0 &&
                        notifications?.map((notification, index) => (
                          <div
                            key={index}
                            onMouseEnter={() =>
                              handleMouseEnterNotification(notification)
                            }
                            onMouseLeave={() =>
                              handleMouseLeaveNotification(notification)
                            }
                          >
                            <div className="box-notification-wrapper">
                              <div
                                onClick={handleReadNotification(
                                  notification.id,
                                  notification.linkWebsite
                                    ? `${buildAbsoluteLink(
                                        notification.linkWebsite
                                      )}`
                                    : "#"
                                )}
                                className={classNames(
                                  "box-notification align-items-center",
                                  {
                                    "box-notification-unread":
                                      notification.unread === true,
                                  }
                                )}
                              >
                                <div className="box-notification-content justify-content-between d-flex m-b--xxxs">
                                  <div className="box-notification-content-left p-l--md p-t--xs">
                                    <div className="box-notification-text-first-row">
                                      {notification?.titleWeb}
                                    </div>
                                    <div className="box-notification-text-second-row m-l--xxxs">
                                      {formatDateTimeFromNow(
                                        notification?.time,
                                        "vi"
                                      )}
                                    </div>
                                    <div className="box-notification-content-content p-b--xs p-t--xxxs p-r--xs text-truncate--3">
                                      {notification?.contentWeb}
                                    </div>
                                  </div>

                                  {!(
                                    notification.unread === true ||
                                    notification.isHover === false ||
                                    notification.isHover === undefined
                                  ) && (
                                    <div className="box-notification-content-right d-flex">
                                      {
                                        <EmailNew16
                                          className="box-notification-header-icon"
                                          onClick={(event) =>
                                            handleUnReadNotification(
                                              event,
                                              notification
                                            )
                                          }
                                        />
                                      }
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
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
                    </div>
                  }
                </InfiniteScroll>
              </div>
            </>
            <div className="border-top d-grid">
              {!notifications?.length &&
                !loadingNotification &&
                notificationDropDown && (
                  <div className="d-flex justify-content-center">
                    <div className="no-data-item">
                      {translate("general.notification.noData")}
                    </div>
                  </div>
                )}
              {notificationDropDown && (
                <div className="notification-footer text-left justify-content-between d-flex">
                  <Button
                    type="ghost"
                    className="d-flex notification-footer-view-all"
                    onClick={handleClickToNotification}
                  >
                    {translate("general.notification.viewAll")}
                    <Launch16 className="m-l--xxxs" />
                  </Button>

                  <Button
                    type="ghost"
                    className="notification-footer-read-all p-l--md p-r--md"
                    onClick={handleClickReadAllNotification}
                  >
                    <Email24 />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any,
};
