import React from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import profileMenuStyle from "./ProfileMenu.module.scss";
//i18n
import { useTranslation, withTranslation } from "react-i18next";
// Redux
import { withRouter } from "react-router-dom";
import Avatar, { ConfigProvider } from "react-avatar";
import { Email16, Login16, User16 } from "@carbon/icons-react";
import { useProfileMenu } from "./ProfileMenuHook";

const ProfileMenu = (props: any) => {
  const [translate] = useTranslation();

  const {
    handleToggerProfile,
    handleMouseLeaveAll,
    profileDrop,
    user,
    handleClickToProfile,
    handleLogout,
    handleClickToChangePassword,
  } = useProfileMenu();

  return (
    <React.Fragment>
      <Dropdown
        isOpen={profileDrop}
        toggle={handleToggerProfile}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          {user?.avatar ? (
            <img
              className="rounded-circle header-profile-user"
              src={user?.avatar}
              alt="Header Avatar"
            />
          ) : (
            <ConfigProvider colors={["red", "green", "blue"]}>
              <Avatar
                maxInitials={1}
                round={true}
                size="22"
                name={user?.name}
              />
            </ConfigProvider>
          )}
        </DropdownToggle>
        <DropdownMenu
          className={`dropdown-menu-end p-l--xxs ${profileMenuStyle["profile_menu_warapper"]}`}
        >
          <div className="">
            <div
              className={` ${profileDrop ? "active" : ""}`}
              onMouseLeave={handleMouseLeaveAll}
            >
              <div onClick={handleClickToProfile} className={`p-b--xxs`}>
                <User16 />
                <span className="p-l--xxxs">{user?.name} </span>
              </div>
              <div onClick={handleClickToChangePassword} className={`p-b--xxs`}>
                <Email16 />
                <span className="p-l--xxxs">
                  {translate("general.actions.changePass")}
                </span>
              </div>

              <li onClick={handleLogout}>
                <Login16 />
                <span className="p-l--xxxs">
                  {translate("general.defaultHeader.logout")}
                </span>
              </li>
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(ProfileMenu) as any);
