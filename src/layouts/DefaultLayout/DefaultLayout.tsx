import { NOT_FOUND_ROUTE } from "config/route-consts";
import { GlobalState } from "config/global";
import React from "react";
import { Switch, useHistory, withRouter } from "react-router";
import { renderRoutes, RouteConfigComponentProps } from "react-router-config";
import { setGlobal } from "reactn";
import DefaultHeader from "./DefaultHeader/DefaultHeader";
import "./DefaultLayout.scss";

function DefaultLayout(props: RouteConfigComponentProps) {
  const history = useHistory();
  const { route, location } = props;
  const [toggle, setToggle] = React.useState<boolean>(true);
  React.useEffect(() => {
    const params = window.location.pathname.split("/");
    const param = window.location.pathname.split("/")[params.length];
    setGlobal<GlobalState>({ toggleSideBar: toggle });
    if (param) {
      if (param !== "create" || !+param.match(/^[0-9]+$/)) {
        history.push(NOT_FOUND_ROUTE);
      }
    }
  }, [history, location, toggle]);
  const handleClickToggle = React.useCallback(() => {
    setToggle(!toggle);
    setGlobal<GlobalState>({ toggleSideBar: !toggle });
  }, [toggle]);

  // sua layout tai day
  return (
    <div className="app">
      <div
        className={toggle === true ? "header-wrapper" : "header-wrapper-out"}
      >
        <DefaultHeader
          className={toggle === true ? "header-in" : "header-out"}
          onToggle={handleClickToggle}
        />
      </div>

      <div className="app-body">
        <main
          className={toggle === true ? "main content-in" : "main content-out"}
        >
          <div className="app-content">
            <Switch>
              {route?.routes instanceof Array && renderRoutes(route.routes)}
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withRouter(DefaultLayout);
