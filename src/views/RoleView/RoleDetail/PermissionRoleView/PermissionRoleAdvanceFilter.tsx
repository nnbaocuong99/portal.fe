/* begin general import */
import { MenuFilter } from "models/Menu";
import { PermissionFilter } from "models/Permission";
import React from "react";
import { useTranslation } from "react-i18next";
import { IdFilter, StringFilter } from "react3l-advanced-filters";
import { AdvanceIdFilter } from "react3l-ui-library";
/* end general import */
/* begin filter import */
import AdvanceStringFilter from "react3l-ui-library/build/components/AdvanceFilter/AdvanceStringFilter";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import { Reducer } from "redux";
import { roleRepository } from "repositories/role-repository";
/* end filter import */
/* begin individual import */
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";
/* end individual import */

export interface PermissionRoleFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function PermissionRoleAdvanceFilter(props: PermissionRoleFilterProps) {
  const [translate] = useTranslation();
  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<PermissionFilter, FilterAction<PermissionFilter>>
  >(filterReducer, filter);

  const { handleChangeInputFilter, handleChangeSelectFilter } =
    filterService.useFilter(filter, setModelFilter);

  const handleSaveModelFilter = React.useCallback(() => {
    handleChangeAllFilter(modelFilter);
    setVisible(false);
  }, [handleChangeAllFilter, modelFilter, setVisible]);

  const handleClearModelFilter = React.useCallback(() => {
    setModelFilter({
      type: 0,
      payload: new PermissionFilter(),
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
          label={translate("permissions.code")}
          showCount={true}
          maxLength={100}
          value={modelFilter["code"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "code",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("permissions.placeholder.code")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          showCount={true}
          maxLength={100}
          label={translate("permissions.name")}
          value={modelFilter["name"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "name",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("permissions.placeholder.name")}
        />
      </div>
      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["menuValue"]}
          placeHolder={translate("permissions.placeholder.menu")}
          classFilter={MenuFilter}
          onChange={handleChangeSelectFilter({
            fieldName: "menu",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          getList={roleRepository.singleListMenu}
          label={translate("permissions.menu")}
        />
      </div>
    </Drawer>
  );
}

export default PermissionRoleAdvanceFilter;
