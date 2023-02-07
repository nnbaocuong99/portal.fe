import { CHeader } from "@coreui/react";
import { Col, Dropdown, Row, Spin } from "antd";
import classNames from "classnames";
import { SIGNALR_CHANNEL } from "config/consts";
import { APP_USER_ROUTE } from "config/route-consts";
import { SignalRContext } from "app/AppContext";
import { formatDateTime } from "helpers/date-time";
import { buildAbsoluteLink } from "helpers/string";
import { AppUser } from "models/AppUser";
import { UserNotification } from "models/UserNotification";
import React, { useContext } from "react";
import Avatar, { ConfigProvider } from "react-avatar";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import { useGlobal } from "reactn";
import {
  Badge,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import "./DefaultHeader.scss";
import useDefaultHeader from "./DefaultHeaderHook";

export interface HeaderProps {
  onToggle?: () => void;
  className?: string;
}

function DefaultHeader(props: HeaderProps) {
  const { onToggle, className } = props;
  const [translate] = useTranslation();

  const signalRContext = useContext(SignalRContext);
  const [user] = useGlobal<AppUser>("user");

  const {
    visibleNotification,
    handleShowApp,
    handleClickToNotification,
    handleToggleNotification,
    visibleApp,
    setVisibleApp,
    menu,
    handleClick,
    codeLanding,
    notifications,
    loadingNotification,
    handleInfiniteOnLoad,
    hasMore,
    total,
    handleReadNotification,
    unreadNotification,
  } = useDefaultHeader(user as AppUser, signalRContext, SIGNALR_CHANNEL, null);

  const handleMouseLeave = React.useCallback(() => {
    setVisibleApp(false);
  }, [setVisibleApp]);

  return (
    <Spin>
      <CHeader
        position="fixed"
        className={classNames(
          "navbar d-flex justify-content-between page-header",
          className
        )}
      >
        <div className="d-flex justify-content-between">
          <div className="icon-nav-bar">
            <i
              className="fa fa-bars ml-4 mt-3 pl-2"
              aria-hidden="true"
              onClick={onToggle}
            />
          </div>
        </div>
        <div className="actions d-flex">
          {/* Notification board */}
          <ButtonDropdown
            direction="left"
            isOpen={visibleNotification}
            toggle={handleToggleNotification}
          >
            <DropdownToggle className="toggle-noti button-hover pt-0 pb-0 pl-3 pr-2">
              <i className=" tio tio-notifications_outlined" />
              <Badge color="danger" className="toggle-noti-badge">
                {unreadNotification}
              </Badge>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>
                {translate("general.notification.title")}
              </DropdownItem>
              {notifications && notifications.length > 0 && (
                <div
                  className="infinite-container"
                  style={{
                    height: "600px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <InfiniteScroll
                    initialLoad={false}
                    loadMore={handleInfiniteOnLoad}
                    hasMore={!loadingNotification && hasMore}
                    threshold={20}
                    useWindow={false}
                    pageStart={516}
                  >
                    <div className="notifications d-flex flex-column align-item-center">
                      {notifications.map((notification: UserNotification) => (
                        <NotificationItem
                          model={notification}
                          key={notification.id}
                          onClick={handleReadNotification}
                        />
                      ))}
                      {!hasMore && (
                        <div
                          className="d-flex justify-content-center p-2"
                          style={{ background: "#e8e8e8", fontSize: 12 }}
                        >
                          Đã hiển thị tất cả <b>&nbsp;{total}&nbsp;</b> thông
                          báo
                        </div>
                      )}
                    </div>
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
              {!notifications?.length && !loadingNotification && (
                <div className="d-flex justify-content-center">
                  <div className="no-data-item">
                    {translate("general.notification.noData")}
                  </div>
                </div>
              )}
              <DropdownItem header className="footer-notification">
                <div onClick={handleClickToNotification}>
                  {translate("general.notification.viewAll")}
                </div>
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
          {/* Account board */}
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            className="pt-2 pb-2 mt-0"
          >
            <div className="button-hover">
              {user?.avatar && (
                <img className="mr-1 avatar" src={user?.avatar} alt="" />
              )}
              {!user?.avatar && (
                <ConfigProvider colors={["red", "green", "blue"]}>
                  <Avatar
                    maxInitials={1}
                    round={true}
                    size="22"
                    name={user?.displayName}
                  />
                </ConfigProvider>
              )}
            </div>
          </Dropdown>
          <i
            onClick={handleShowApp}
            className="pb-2 pl-2 pr-3 pt-2 float-right tio tio-menu_vs_outlined icon-port button-menu-hover"
          />
        </div>
        {/* App board */}
        {visibleApp && (
          <div
            className={classNames("menu-right")}
            onMouseLeave={handleMouseLeave}
          >
            <Row>
              <i
                onClick={handleShowApp}
                className="mb-3 ml-2 mr-3 mt-3 float-right tio tio-red tio-menu_vs_outlined "
              />
            </Row>
            <Row className="row-menu">
              <Col lg={12} className="pl-3">
                <div className="">{translate("general.defaultHeader.app")}</div>
              </Col>
              <Col lg={12}>
                <div>
                  <a
                    className="gateway"
                    href="/"
                    onClick={handleClick(`${codeLanding}`)}
                  >
                    <div className="d-flex justify-content-end align-items-center">
                      {translate("general.defaultHeader.gateway")}
                      <i className="tio-arrow_long_right mr-2 ml-2" />
                    </div>
                  </a>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="full-box">
                  {user?.appUserSiteMappings?.length > 0 &&
                    user?.appUserSiteMappings?.map(
                      (item: any) =>
                        item?.enabled &&
                        item.siteId < 100 && (
                          <div className="box" key={item?.siteId}>
                            {/* eslint-disable-next-line */}
                            <a
                              className="d-flex align-items-center"
                              href="#"
                              onClick={handleClick(`${item?.site.code}`)}
                            >
                              <div className={item?.site.code.split("/")[1]}>
                                {/* {item?.site.icon && ( */}
                                <img
                                  className="icon"
                                  src={item?.site.icon}
                                  alt=""
                                  width="40"
                                  height="40"
                                />
                                {/* )} */}
                                {/* {project.icon && (
                            <i className={classNames('icon', project.icon)} />
                          )} */}
                              </div>
                              <div>
                                <div
                                  className={classNames(
                                    "app-text",
                                    `text-${item?.site.code.split("/")[1]}`
                                  )}
                                >
                                  <p>
                                    {translate("general.defaultHeader.app")}
                                  </p>
                                  <p className="app-name">
                                    {" "}
                                    {translate(item?.site.name)}
                                  </p>
                                </div>
                              </div>
                            </a>
                          </div>
                        )
                    )}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </CHeader>
    </Spin>
  );
}

export interface NotificationItemProps {
  model?: UserNotification;
  onClick?: (
    id: number,
    url: string
  ) => (ev: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const NotificationItem = (props: NotificationItemProps) => {
  const { model, onClick } = props;
  const { contentWeb, time, unread, linkWebsite, id, siteId } = model;

  return (
    <DropdownItem className="mt-2">
      <Link
        to={{
          pathname: linkWebsite
            ? `${buildAbsoluteLink(linkWebsite)}`
            : APP_USER_ROUTE,
        }}
        onClick={onClick(
          id,
          linkWebsite ? `${buildAbsoluteLink(linkWebsite)}` : "#"
        )}
      >
        <div className="notification ml-1 d-flex align-items-center align-content-center pt-2 pb-2">
          {unread === true ? (
            <>
              {siteId === 2 && (
                <div className="icon-noti-dms ml-1 mr-3">
                  <i className="tio-shop_outlined" />
                </div>
              )}

              {siteId === 1 && (
                <div className="icon-noti-portal ml-1 mr-3">
                  <i className="tio-shop_outlined" />
                </div>
              )}

              {siteId === 3 && (
                <div className="icon-noti-crm ml-1 mr-3">
                  <i className="tio-shop_outlined" />
                </div>
              )}

              {siteId === 4 && (
                <div className="icon-noti-report ml-1 mr-3">
                  <i className="tio-shop_outlined" />
                </div>
              )}
              <div className="content-noti">
                <Row>
                  <Col span={24} className="mb-2">
                    <div
                      className="content-noti-ellipsis"
                      dangerouslySetInnerHTML={{
                        __html: contentWeb,
                      }}
                    ></div>
                  </Col>
                  <Col span={24}>
                    <span>
                      <b>{formatDateTime(time)}</b>
                    </span>
                  </Col>
                </Row>
              </div>
            </>
          ) : (
            <>
              <div className="icon-noti-read ml-1 mr-3">
                <i className="tio-shop_outlined" />
              </div>
              <div className="content-noti">
                <Row>
                  <Col span={24} className="mb-2">
                    <div
                      className="content-noti-ellipsis"
                      dangerouslySetInnerHTML={{
                        __html: contentWeb,
                      }}
                    ></div>
                  </Col>
                  <Col span={24}>
                    <span>
                      <b>{formatDateTime(time)}</b>
                    </span>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </div>
      </Link>
    </DropdownItem>
  );
};

NotificationItem.defaultProps = {
  model: new UserNotification(),
};

export default DefaultHeader;
