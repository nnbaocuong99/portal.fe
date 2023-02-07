import useApp from "app/appHook";
import RightSidebar from "components/CommonForBoth/RightSidebar/RightSidebar";
import LanguageDropdown from "components/CommonForBoth/TopbarDropdown/LanguageDropdown/LanguageDropdown";
import NotificationDropdown from "components/CommonForBoth/TopbarDropdown/NotificationDropdown/NotificationDropdown";
import ProfileMenu from "components/CommonForBoth/TopbarDropdown/ProfileMenu/ProfileMenu";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactDrawer from "react-drawer";
import "react-drawer/lib/react-drawer.css";
// Import menuDropdown
// import logo from "assets/images/logo.svg";
// import logoLight from "assets/images/logo-light.png";
// import logoLightSvg from "assets/images/logo-light.svg";
// import logoDark from "assets/images/logo-dark.png";
//i18n
import { useTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// Redux Store
// reactstrap
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { showRightSidebarAction, toggleLeftmenu } from "store/actions";
import Navbar from "../Navbar/Navbar";
import { AppUserSiteMapping, useHeaderHook } from "./HeaderHook";
import headerStyle from "./Header.module.scss";
import classNames from "classnames";

interface Document extends HTMLDocument {
  mozFullScreenElement: any;
  webkitFullscreenElement: any;
  mozRequestFullScreen: any;
  webkitRequestFullscreen: any;
  cancelFullScreen: () => void;
  mozCancelFullScreen: () => void;
  webkitCancelFullScreen: () => void;
}

const Header = (props: any) => {
  const [isSearch, setSearch] = useState(false);
  const [position, setPosition] = useState<string>();
  const [open, setOpen] = useState(false);
  const [translate] = useTranslation();
  const codeLanding = "/landing-page";
  const { state } = useApp();
  const currentUserInfo = JSON.parse(localStorage.getItem("currentUserInfo"));

  const currentSite = React.useMemo(() => {
    if (
      currentUserInfo &&
      currentUserInfo?.appUserSiteMappings &&
      currentUserInfo?.appUserSiteMappings.length > 0
    ) {
      return currentUserInfo.appUserSiteMappings.filter(
        (item: AppUserSiteMapping) => {
          return item.site.code.includes(process.env.PUBLIC_URL);
        }
      )[0]?.site;
    }
  }, [currentUserInfo]);

  const toggleTopDrawer = () => {
    setPosition("right");
    setOpen(!open);
  };

  const onDrawerClose = () => {
    setOpen(false);
  };

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !(document as Document)
        .mozFullScreenElement &&
      !(document as Document).webkitFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if ((document as Document).cancelFullScreen) {
        (document as Document).cancelFullScreen();
      } else if ((document as Document).mozCancelFullScreen) {
        (document as Document).mozCancelFullScreen();
      } else if ((document as Document).webkitCancelFullScreen) {
        (document as Document).webkitCancelFullScreen();
      }
    }
  }

  const { handleToggerGateway, gatewayDropDown, handleClick } =
    useHeaderHook(state);

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex navbar-header--inner align-items-center">
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={currentSite?.icon} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={currentSite?.icon} alt="" height="17" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={currentSite?.icon} alt="" height="22" />
                  {/* {currentSite?.name} */}
                </span>
                <span className="logo-lg">
                  <img src={currentSite?.icon} alt="" height="19" />
                  {/* {currentSite?.name} */}
                </span>
              </Link>

              <span
                className={classNames(
                  headerStyle["header__brand__name"],
                  "navbar-brand-name"
                )}
              >
                Portal.IO
              </span>
            </div>
            <button
              type="button"
              className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
              data-toggle="collapse"
              onClick={() => {
                props.toggleLeftmenu(!props.leftMenu);
              }}
              data-target="#topnav-menu-content"
            >
              <i className="fa fa-fw fa-bars" />
            </button>
            <div className="navbar-menu navbar-menu--sm">
              <Navbar />
            </div>
          </div>

          <div className="d-flex navbar-header--inner align-items-center">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                type="button"
                className="btn header-item noti-icon "
                id="page-header-search-dropdown"
                onClick={() => setSearch(!isSearch)}
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  isSearch
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={props.t("Search") + "..."}
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <LanguageDropdown />

            <Dropdown
              className="d-none d-lg-inline-block ms-1"
              isOpen={gatewayDropDown}
              toggle={handleToggerGateway}
            >
              <DropdownToggle
                className="btn header-item noti-icon "
                caret
                tag="button"
              >
                <i className="bx bx-customize" />
              </DropdownToggle>
              <DropdownMenu
                className={`dropdown-menu-lg ${headerStyle["header_dropdown-menu-left"]}`}
              >
                <div
                  className={`p-l--sm p-r--sm ${
                    gatewayDropDown ? "active" : ""
                  }`}
                >
                  <div className="row-menu d-flex align-items-center justify-content-between">
                    <div
                      className={`${headerStyle["header_dropdown-header-text-left"]}`}
                    >
                      {translate("general.header.app")}
                    </div>
                    <div>
                      <div
                        onClick={handleClick(`${codeLanding}`)}
                        className={`${headerStyle["header_dropdown-header-text-right"]} d-flex justify-content-end align-items-center`}
                      >
                        {translate("general.header.gateWay")}
                      </div>
                    </div>
                  </div>
                  <div className={`${headerStyle["header_dropdown-content"]}`}>
                    {state?.user?.appUserSiteMappings?.length > 0 &&
                      state?.user?.appUserSiteMappings?.map(
                        (item: any, index: number) =>
                          item?.enabled &&
                          item.siteId < 100 && (
                            <div
                              className={`${headerStyle["site-box"]} d-flex align-items-center p-t--lg`}
                              key={item?.siteId}
                              onClick={handleClick(`${item?.site.code}`)}
                            >
                              <div className={item?.site.code.split("/")[1]}>
                                <img
                                  className="icon"
                                  src={item?.site.icon}
                                  alt=""
                                  width="40"
                                  height="40"
                                />
                              </div>
                              <div className="p-l--xs">
                                <div
                                  className={`${headerStyle["header_dropdown-content-first-row"]}`}
                                >
                                  <div>{translate("general.header.app")}</div>
                                  <div
                                    className={`${headerStyle["header_dropdown-content-second-row"]}`}
                                  >
                                    {translate(item?.site.name)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                      )}
                  </div>
                </div>
              </DropdownMenu>
            </Dropdown>

            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                className="btn header-item noti-icon "
                onClick={() => {
                  toggleFullscreen();
                }}
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen" />
              </button>
            </div>

            <NotificationDropdown />

            <ProfileMenu />

            <div className="dropdown d-inline-block">
              <button
                onClick={toggleTopDrawer}
                disabled={open}
                type="button"
                className="btn header-item noti-icon right-bar-toggle "
              >
                <i className="bx bx-cog bx-spin" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <ReactDrawer open={open} position={position} onClose={onDrawerClose}>
        <RightSidebar onClose={onDrawerClose} />
      </ReactDrawer>
    </React.Fragment>
  );
};

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = (state: any) => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(withTranslation()(Header));
