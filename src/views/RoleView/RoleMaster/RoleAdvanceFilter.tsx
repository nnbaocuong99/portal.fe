/* begin general import */
import { RoleFilter } from "models/Role";
import { StatusFilter } from "models/Status";
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

export interface RoleFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function RoleAdvanceFilter(props: RoleFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<RoleFilter, FilterAction<RoleFilter>>
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
          label={translate("roles.code")}
          showCount={true}
          maxLength={100}
          value={modelFilter["code"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "code",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("roles.placeholder.code")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("roles.name")}
          showCount={true}
          maxLength={100}
          value={modelFilter["name"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "name",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("roles.placeholder.name")}
        />
      </div>
      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["statusValue"]}
          placeHolder={translate("roles.placeholder.status")}
          classFilter={StatusFilter}
          onChange={handleChangeSelectFilter({
            fieldName: "status",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          getList={roleRepository.singleListStatus}
          label={translate("roles.status")}
        />
      </div>
    </Drawer>
  );
}

export default RoleAdvanceFilter;
