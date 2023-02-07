import React from "react";
import { Menu as AntdMenu, Avatar } from "antd";
import { ChevronDown16 } from "@carbon/icons-react";
import { NavLink, useHistory } from "react-router-dom";
import { Menu, menu } from "config/menu";
import "./Sidebar.scss";
const { SubMenu } = AntdMenu;

function Sidebar() {
  const [listActiveMenu, setListActiveMenu] = React.useState<string[]>([]);
  const [listOpen, setListOpen] = React.useState<string[]>([]);
  const history = useHistory();
  const currentUserInfo = JSON.parse(localStorage.getItem("currentUserInfo"));

  const makeOpen = React.useCallback(
    (path: string) => {
      const arrayPath = path.split("/");
      arrayPath.pop();
      const open = arrayPath.join("/");

      listOpen.push(open);

      if (arrayPath.length > 3) {
        makeOpen(open);
      }

      return listOpen;
    },
    [listOpen]
  );

  // handle active menu
  const handleActiveMenu = React.useCallback(
    (path: string) => {
      setListOpen(makeOpen(path));
      setListActiveMenu([path]);
    },
    [makeOpen]
  );

  // using when navigate
  React.useEffect(() => {
    return history.listen((location) => {
      handleActiveMenu(location.pathname);
    });
  }, [handleActiveMenu, history, makeOpen]);

  // using when f5
  React.useEffect(() => {
    handleActiveMenu(window.location.pathname);
  }, [handleActiveMenu]);

  const renderMenu = React.useCallback((listMenu: Menu[]) => {
    return listMenu.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu key={item.link} title={item.name}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        <AntdMenu.Item key={item.link}>
          <NavLink to={item.link}>{item.name}</NavLink>
        </AntdMenu.Item>
      );
    });
  }, []);
  return (
    <div className="sidebar__wrapper">
      <div className="sidebar__title">
        <Avatar
          shape="square"
          size={32}
          style={{ backgroundColor: "#A7F0BA", color: "#161616" }}
        >
          M
        </Avatar>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{ fontSize: "14px", fontWeight: "bold", color: "#161616" }}
          >
            {currentUserInfo?.currentProject?.name}
          </div>
          <div style={{ fontSize: "10px", color: "#6F6F6F" }}>
            {currentUserInfo?.currentProject?.code}
          </div>
        </div>
      </div>
      <AntdMenu
        style={{ width: 200 }}
        defaultSelectedKeys={["5"]}
        defaultOpenKeys={listOpen}
        mode="inline"
        expandIcon={<ChevronDown16 />}
        selectedKeys={listActiveMenu}
      >
        {renderMenu(menu)}
      </AntdMenu>
    </div>
  );
}

export default Sidebar;
