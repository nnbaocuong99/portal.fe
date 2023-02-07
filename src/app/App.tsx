import PropTypes from "prop-types";
import React from "react";

import { connect, ConnectedComponent } from "react-redux";

// layouts Format
import VerticalLayout from "../components/VerticalLayout";
import HorizontalLayout from "../components/HorizontalLayout";

// Import scss
import "assets/scss/theme.scss";
import { AppStateContext, SignalRContext } from "./AppContext";
import { authorizationService } from "services/authorization-service";
import signalRService from "services/signalr-service";

const App = (props: any) => {
  const Layout: ConnectedComponent<any, any> = React.useMemo(() => {
    let layoutCls;
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }, [props.layout.layoutType]);

  const {
    permissionPaths,
    authorizedMenus,
    authorizedMenuMapper,
    authorizedAction,
  } = authorizationService.useAuthorizedApp();

  React.useEffect(() => {
    //write listPath api call here
  }, []);

  return (
    <React.Fragment>
      <SignalRContext.Provider value={signalRService}>
        <AppStateContext.Provider
          value={{
            permissionPaths,
            authorizedMenus,
            authorizedMenuMapper,
            authorizedAction,
          }}
        >
          <Layout>{props.children}</Layout>
        </AppStateContext.Provider>
      </SignalRContext.Provider>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state: any) => {
  return {
    layout: state.Layout,
    authorized: state.Authorized,
  };
};

export default connect(mapStateToProps, {})(App);
