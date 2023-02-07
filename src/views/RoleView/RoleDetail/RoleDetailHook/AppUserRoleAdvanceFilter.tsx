/* begin general import */
import { RoleFilter } from "models/Role";
import React from "react";
import { useTranslation } from "react-i18next";
import { StringFilter } from "react3l-advanced-filters";
/* end general import */
/* begin filter import */
import AdvanceStringFilter from "react3l-ui-library/build/components/AdvanceFilter/AdvanceStringFilter";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import { Reducer } from "redux";
/* end filter import */
/* begin individual import */
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";
/* end individual import */

export interface AppUserRoleFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function AppUserRoleAdvanceFilter(props: AppUserRoleFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<RoleFilter, FilterAction<RoleFilter>>
  >(filterReducer, filter);

  const { handleChangeInputFilter } = filterService.useFilter(
    filter,
    setModelFilter
  );

  const handleSaveModelFilter = React.useCallback(() => {
    handleChangeAllFilter(modelFilter);
    setVisible(false);
  }, [handleChangeAllFilter, modelFilter, setVisible]);

  const handleClearModelFilter = React.useCallback(() => {
    setModelFilter({
      type: 0,
      payload: new RoleFilter(),
    });
  }, [setModelFilter]);

  return (
    <Drawer
      visible={visible}
      handleSave={handleSaveModelFilter}
      handleCancel={handleClearModelFilter}
      handleClose={handleClose}
      visibleFooter={true}
      loading={false}
      size={"sm"}
      title={translate("general.drawer.filter")}
      titleButtonCancel={translate("general.actions.clear")}
      titleButtonApply={translate("general.actions.apply")}
    >
      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("roles.displayName")}
          value={modelFilter["displayName"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "displayName",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          showCount={true}
          maxLength={100}
          placeHolder={translate("roles.appUsers.displayName")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("roles.username")}
          value={modelFilter["username"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "username",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          showCount={true}
          maxLength={100}
          placeHolder={translate("roles.appUsers.username")}
        />
      </div>
      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("roles.phone")}
          value={modelFilter["phone"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "phone",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          showCount={true}
          maxLength={100}
          placeHolder={translate("roles.appUsers.phone")}
        />
      </div>
      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("roles.email")}
          value={modelFilter["email"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "email",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          showCount={true}
          maxLength={100}
          placeHolder={translate("roles.appUsers.email")}
        />
      </div>
    </Drawer>
  );
}

export default AppUserRoleAdvanceFilter;
