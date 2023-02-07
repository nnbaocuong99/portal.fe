import {
  APP_USER_DETAIL_ROUTE,
  APP_USER_MASTER_ROUTE,
} from "config/route-consts";
import React, { useEffect, useRef } from "react";
import authenticationService from "services/authentication-service";
import "./DropdownMenu.scss";
export interface DropdownMenuProps {
  setIsShowAccountDropdown?: React.Dispatch<React.SetStateAction<boolean>>;
}
function DropdownMenu(props: DropdownMenuProps) {
  const { setIsShowAccountDropdown } = props;
  const user = JSON.parse(localStorage.getItem("currentUserInfo"));

  const handleClickToProfile = React.useCallback(() => {
    window.location.href = `${APP_USER_DETAIL_ROUTE}?id=${user?.id}`;
  }, [user?.id]);
  const handleClickToChangePassword = React.useCallback(() => {
    window.location.href = `${APP_USER_MASTER_ROUTE}?idChangePassword=${user?.id}`;
  }, [user?.id]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowAccountDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setIsShowAccountDropdown]);

  const handleLogout = React.useCallback(() => {
    authenticationService.logout();
  }, []);

  return (
    <div className="dropdown__wrapper" ref={dropdownRef}>
      <div className="dropdown__container">
        <div className="dropdown__list-item p-x--sm">
          <div className="dropdown__item dropdown__item-username p-y--sm">
            {user?.username}
          </div>
          <div
            className="dropdown__item dropdown__item-account p-y--sm "
            onClick={handleClickToProfile}
          >
            Account
          </div>
          <div
            className="dropdown__item dropdown__item-change-password p-y--sm"
            onClick={handleClickToChangePassword}
          >
            Change password
          </div>
          <div
            className="dropdown__item dropdown__item-sign-out p-y--sm"
            onClick={handleLogout}
          >
            Sign out
          </div>
        </div>
      </div>
    </div>
  );
}

export default DropdownMenu;
