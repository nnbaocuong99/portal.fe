/* begin general import */
import { AppUserFilter } from "models/AppUser";
import { OrganizationFilter } from "models/Organization";
import { SexFilter } from "models/Sex";
import { StatusFilter } from "models/Status";
import React from "react";
import { useTranslation } from "react-i18next";
import { IdFilter, StringFilter } from "react3l-advanced-filters";
import AdvanceIdFilter from "react3l-ui-library/build/components/AdvanceFilter/AdvanceIdFilter";
/* end general import */
/* begin filter import */
import AdvanceStringFilter from "react3l-ui-library/build/components/AdvanceFilter/AdvanceStringFilter";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import { Reducer } from "redux";
/* end filter import */
/* begin individual import */
import { appUserRepository } from "repositories/app-user-repository";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";

/* end individual import */

export interface AppUserFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function AppUserAdvanceFilter(props: AppUserFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<AppUserFilter, FilterAction<AppUserFilter>>
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
      payload: new AppUserFilter(),
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
          label={translate("appUsers.username")}
          showCount={true}
          maxLength={100}
          value={modelFilter["username"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "username",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("appUsers.placeholder.username")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("appUsers.displayName")}
          showCount={true}
          maxLength={100}
          value={modelFilter["displayName"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "displayName",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("appUsers.placeholder.displayName")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("appUsers.address")}
          showCount={true}
          maxLength={100}
          value={modelFilter["address"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "address",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("appUsers.placeholder.address")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("appUsers.email")}
          showCount={true}
          maxLength={100}
          value={modelFilter["email"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "email",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("appUsers.placeholder.email")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("appUsers.phone")}
          showCount={true}
          maxLength={100}
          value={modelFilter["phone"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "phone",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("appUsers.placeholder.phone")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["organizationValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "organization",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={OrganizationFilter}
          getList={appUserRepository.filterListOrganization}
          placeHolder={translate("appUsers.placeholder.organization")}
          label={translate("appUsers.organization")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["sexValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "sex",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={SexFilter}
          getList={appUserRepository.filterListSex}
          placeHolder={translate("appUsers.placeholder.sex")}
          label={translate("appUsers.sex")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          value={modelFilter["statusValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "status",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={StatusFilter}
          getList={appUserRepository.filterListStatus}
          placeHolder={translate("appUsers.placeholder.status")}
          label={translate("appUsers.status")}
        />
      </div>
    </Drawer>
  );
}

export default AppUserAdvanceFilter;
