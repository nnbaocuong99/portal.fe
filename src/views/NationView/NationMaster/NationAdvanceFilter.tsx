/* begin general import */
import { NationFilter } from "models/Nation";
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
import { nationRepository } from "repositories/nation-repository";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";

/* end individual import */

export interface NationFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function NationAdvanceFilter(props: NationFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<NationFilter, FilterAction<NationFilter>>
  >(filterReducer, filter);

  const {
    handleChangeInputFilter,
    handleChangeSelectFilter,
  } = filterService.useFilter(filter, setModelFilter);

  const handleSaveModelFilter = React.useCallback(() => {
    handleChangeAllFilter(modelFilter);
    setVisible(false);
  }, [handleChangeAllFilter, modelFilter, setVisible]);

  const handleClearModelFilter = React.useCallback(() => {
    setModelFilter({
      type: 0,
      payload: new NationFilter(),
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
          label={translate("nations.code")}
          showCount={true}
          maxLength={100}
          value={modelFilter["code"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "code",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("nations.placeholder.code")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("nations.name")}
          showCount={true}
          maxLength={100}
          value={modelFilter["name"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "name",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("nations.placeholder.name")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          label={translate("nations.status")}
          value={modelFilter["statusValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "status",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={StatusFilter}
          getList={nationRepository.filterListStatus}
          placeHolder={translate("nations.placeholder.status")}
        />
      </div>
    </Drawer>
  );
}

export default NationAdvanceFilter;
