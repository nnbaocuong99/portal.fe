/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Divider, Row, Spin } from "antd";
import axios, { AxiosResponse } from "axios";
import classNames from "classnames";
import { SIGNALR_CHANNEL } from "config/consts";
import { SignalRContext } from "app/AppContext";
import useDefaultHeader from "layouts/DefaultLayout/DefaultHeader/DefaultHeaderHook";
import { AppUserSiteMapping } from "models/AppUserSiteMapping";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
// import { ButtonDropdown, DropdownToggle } from "reactstrap";
import "./LandingPage.scss";
import { AppUser } from "models/AppUser";
// import { MenuOutlined } from "@ant-design/icons";
import authenticationService from "services/authentication-service";
import { userNotificationRepository } from "repositories/user-notification-repository";
import { UserNotificationFilter } from "models/UserNotification";
import LandingPageHeader from "./LandingPageHeader";
import LandingPageDrawer from "./LandingPageDrawer/LandingPageDrawer";

function LandingPage() {
  const firstLoad = React.useRef<boolean>(true);
  const [user, setUser] = React.useState<AppUser>();
  const signalRContext = useContext(SignalRContext);
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1; // func getMonth return a value = standard month - 1
  const days = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const dayName = days[new Date().getDay()];

  const [weather, setWeather] = React.useState<any>(null);
  const [temp, setTemp] = React.useState<number>(null);
  const [translate] = useTranslation();
  const [description, setDescription] = React.useState<string[]>(null);
  const [unreadAll, setUnreadAll] = React.useState<number>(null);
  const [notificationFilter] = React.useState<UserNotificationFilter>(
    new UserNotificationFilter()
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { menu, visibleMenuAction, handleToggleMenuAction } = useDefaultHeader(
    user,
    signalRContext,
    SIGNALR_CHANNEL,
    unreadAll
  );
  React.useEffect(() => {
    if (firstLoad.current) {
      authenticationService.checkAuth().subscribe((res) => setUser(res));
    }
  }, []);

  const [loadingLandingPage, setLoadingLandingPage] =
    React.useState<boolean>(true);

  React.useEffect(() => {
    if (user) {
      setLoadingLandingPage(false);
    }
  }, [user]);

  const startTime = React.useCallback(() => {
    const today = new Date();
    const h = today.getHours();
    let m = today.getMinutes();
    // let s = today.getSeconds();
    m = checkTime(m);
    // s = checkTime(s);
    if (document.getElementById("clock")) {
      document.getElementById("clock").innerHTML = h + ":" + m;
    }

    setTimeout(startTime, 500);
  }, []);

  function checkTime(i: any) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }

  // check if list site include siteTypeId
  const handleCheckIncludeSiteType = React.useCallback(
    (siteTypeId: number) => {
      if (user?.appUserSiteMappings && user?.appUserSiteMappings?.length > 0) {
        const listSiteTypeId = user?.appUserSiteMappings.map(
          (siteItem: { site: any }) => siteItem?.site?.siteTypeId
        );
        if (listSiteTypeId.includes(siteTypeId)) {
          return true;
        }
      }
      return false;
    },
    [user?.appUserSiteMappings]
  );

  const items = React.useCallback(
    (siteTypeId?: number) => (
      <React.Fragment>
        {user?.appUserSiteMappings?.length > 0 &&
          user?.appUserSiteMappings
            ?.filter(
              (siteItem: { site: any }) =>
                siteItem?.site?.siteTypeId === siteTypeId
            )
            .map(
              (item: any, i: any) =>
                item?.enabled &&
                item.siteId < 100 && <SiteCard key={i} item={item} index={i} />
            )}
      </React.Fragment>
    ),
    [user]
  );

  const [isShowDrawer, setIsShowDrawer] = React.useState<boolean>(false);

  return (
    <>
      <CSSTransition
        in={!loadingLandingPage}
        timeout={100}
        classNames="landing-page"
        unmountOnExit
        onLoad={startTime}
      >
        <div className="landing-page">
          <LandingPageHeader
            isShowDrawer={isShowDrawer}
            setIsShowDrawer={setIsShowDrawer}
          />
          <div className="landing-page__content p-l--sm p-r--xxl">
            <div className="landing-page__breadcrumb p-l--sm p-b--sm">
              <div className="landing-page__breadcrumb-item--small m-b--xxs">
                Home/
              </div>
              <div className="landing-page__breadcrumb-item--big">
                Tất cả ứng dụng
              </div>
            </div>

            <div className="list-site-box__wrapper">
              <div className="landing-page__list-site-box">
                {handleCheckIncludeSiteType(3) && (
                  <div
                    className={`landing-page__list-site-container p-t--lg p-b--xxl ${
                      handleCheckIncludeSiteType(2) ? "not-last" : ""
                    } `}
                  >
                    <div className="landing-page__site-grouping-title m-b--sm p-l--sm">
                      Bán hàng
                    </div>

                    <div className="list-site-wrapper">{items(3)}</div>
                  </div>
                )}

                {handleCheckIncludeSiteType(2) && (
                  <>
                    <div
                      className={`landing-page__list-site-container p-t--lg p-b--xxl ${
                        handleCheckIncludeSiteType(1) ? "not-last" : ""
                      }`}
                    >
                      <div className="landing-page__site-grouping-title m-b--sm p-l--sm">
                        Vận hành
                      </div>

                      <div className="list-site-wrapper">{items(2)}</div>
                    </div>
                  </>
                )}
                {handleCheckIncludeSiteType(1) && (
                  <div className="landing-page__list-site-container p-t--lg p-b--xxl">
                    <div className="landing-page__site-grouping-title m-b--sm p-l--sm">
                      Cài đặt
                    </div>

                    <div className="list-site-wrapper">{items(1)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <LandingPageDrawer isShowDrawer={isShowDrawer} />
        </div>
      </CSSTransition>
      <CSSTransition
        in={loadingLandingPage}
        timeout={100}
        classNames="landing-page-mask"
        unmountOnExit
      >
        <div id="loader-wrapper">
          <div id="loader"></div>

          <div className="loader-section section-left"></div>
          <div className="loader-section section-right"></div>
        </div>
      </CSSTransition>
    </>
  );
}

export interface SiteCardProps {
  index: number;
  item: AppUserSiteMapping;
}

export function SiteCard(props: AppUserSiteMapping) {
  const { item } = props;

  const handleClickSite = React.useCallback(() => {
    window.location.href = `${item?.site?.code}`;
  }, [item]);

  return (
    <div
      className="site-card__container p--sm m-x--sm m-b--sm"
      onClick={handleClickSite}
    >
      <div className="site-card__icon m-b--xxs">
        <img src={item?.site?.darkIcon} alt="" />
      </div>
      <div className="site-card__title m-b--xxxs">{item?.site?.name}</div>
      <div className="site-card__description text-truncate">
        {item?.site?.description}
      </div>
    </div>
  );
}

export default LandingPage;
