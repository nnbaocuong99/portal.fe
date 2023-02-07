import {
  Search20,
  Notification20,
  Settings20,
  UserAvatar20,
  Switcher20,
  Loop24,
  Close20,
} from "@carbon/icons-react";
import { useCallback, useState } from "react";
import DropdownMenu from "./DropdownMenu/DropdownMenu";

export interface LandingPageHeaderProps {
  isShowDrawer?: boolean;
  setIsShowDrawer?: React.Dispatch<boolean>;
}

function LandingPageHeader(props: LandingPageHeaderProps) {
  const { isShowDrawer, setIsShowDrawer } = props;

  const [isShowAccountDropdown, setIsShowAccountDropdown] =
    useState<boolean>(false);
  const handleShowAccountDropdown = useCallback(() => {
    setIsShowAccountDropdown(true);
  }, []);

  return (
    <>
      <div className="login-header__wrapper  p-y--xs">
        <div className="login-header__logo p-x--sm">
          <div>
            <Loop24 color={"#fff"} />
          </div>
          <div className="m-l--xxs">Portal</div>
        </div>
        <div className="login-header__list-icon">
          <div className="login-header__icon login-header__icon-search d-flex align-items-center justify-content-center">
            <Search20 color={"#fff"} />
          </div>
          <div className="login-header__icon login-header__icon-notification d-flex align-items-center justify-content-center">
            <Notification20 color={"#fff"} />
          </div>
          <div className="login-header__icon login-header__icon-setting d-flex align-items-center justify-content-center">
            <Settings20 color={"#fff"} />
          </div>
          <div
            className={`login-header__icon login-header__icon-user d-flex align-items-center justify-content-center ${
              isShowAccountDropdown ? "active-item" : ""
            }`}
            onClick={handleShowAccountDropdown}
          >
            <UserAvatar20 color={"#fff"} />
          </div>
          <div
            className={`login-header__icon login-header__icon-switch d-flex align-items-center justify-content-center ${
              isShowDrawer && "login-header__icon-close"
            }`}
            onClick={() => setIsShowDrawer(!isShowDrawer)}
          >
            {!isShowDrawer ? (
              <Switcher20 color={"#fff"} />
            ) : (
              <Close20 color={"#fff"} />
            )}
          </div>
        </div>
      </div>
      {isShowAccountDropdown && (
        <DropdownMenu setIsShowAccountDropdown={setIsShowAccountDropdown} />
      )}
    </>
  );
}

export default LandingPageHeader;
