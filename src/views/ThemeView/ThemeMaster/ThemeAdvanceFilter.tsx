/* begin general import */
import { ThemeFilter } from "models/Theme";
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

export interface ThemeFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function ThemeAdvanceFilter(props: ThemeFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<ThemeFilter, FilterAction<ThemeFilter>>
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
      payload: new ThemeFilter(),
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
          label={translate("themes.code")}
          showCount={true}
          maxLength={100}
          value={modelFilter["code"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "code",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("themes.placeholder.code")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("themes.name")}
          showCount={true}
          maxLength={100}
          value={modelFilter["name"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "name",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("themes.placeholder.name")}
        />
      </div>
    </Drawer>
  );
}

export default ThemeAdvanceFilter;
