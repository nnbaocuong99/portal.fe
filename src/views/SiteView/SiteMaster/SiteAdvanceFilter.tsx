/* begin general import */
import { SiteFilter } from "models/Site";
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
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";
/* end individual import */

export interface SiteFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function SiteAdvanceFilter(props: SiteFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<SiteFilter, FilterAction<SiteFilter>>
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
      payload: new SiteFilter(),
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
          label={translate("sites.code")}
          showCount={true}
          maxLength={100}
          value={modelFilter["code"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "code",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("sites.placeholder.code")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("sites.name")}
          showCount={true}
          maxLength={100}
          value={modelFilter["name"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "name",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("sites.placeholder.name")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("sites.description")}
          showCount={true}
          maxLength={100}
          value={modelFilter["description"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "description",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("sites.placeholder.description")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("sites.icon")}
          showCount={true}
          maxLength={100}
          value={modelFilter["icon"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "icon",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("sites.placeholder.icon")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("sites.logo")}
          showCount={true}
          maxLength={100}
          value={modelFilter["logo"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "logo",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("sites.placeholder.logo")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("sites.colorCode")}
          showCount={true}
          maxLength={100}
          value={modelFilter["colorCode"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "colorCode",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("sites.placeholder.colorCode")}
        />
      </div>
    </Drawer>
  );
}

export default SiteAdvanceFilter;
