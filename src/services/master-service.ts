import { Modal } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Model } from "react3l-common";

export const masterService = {
  useMasterAction(routeView: string, deleteAction?: (t: Model) => void) {
    const history = useHistory();
    const [translate] = useTranslation();

    const baseRoute = React.useMemo(() => {
      let listPath = routeView.split("/");
      const baseRoute = "/" + listPath[listPath.length - 1];
      return baseRoute;
    }, [routeView]);

    const handleGoCreate = React.useCallback(() => {
      history.push(`${routeView}${baseRoute}-detail`);
    }, [routeView, baseRoute, history]);

    const handleGoDetail = React.useCallback(
      (id: any) => {
        return () => {
          history.push(`${routeView}${baseRoute}-detail?id=${id}`);
        };
      },
      [routeView, baseRoute, history]
    );

    const handleGoMaster = React.useCallback(() => {
      history.replace(`${routeView}${baseRoute}-master`);
    }, [routeView, baseRoute, history]);

    const handleDeleteItem = React.useCallback(
      (item: Model) => (event: any) => {
        if (typeof deleteAction !== undefined) {
          Modal.confirm({
            title: translate("general.delete.content"),
            content: translate("general.delete.title"),
            cancelText: translate("general.delete.cancel"),
            okType: "danger",
            onOk() {
              deleteAction(item);
            },
          });
        }
      },
      [deleteAction, translate]
    );

    return {
      history,
      handleGoCreate,
      handleGoDetail,
      handleGoMaster,
      handleDeleteItem,
    };
  },
};
