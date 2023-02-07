/* begin general import */
import { DistrictFilter } from "models/District";
import { ProvinceFilter } from "models/Province";
import { StatusFilter } from "models/Status";
import React from "react";
import { useTranslation } from "react-i18next";
import { IdFilter, NumberFilter, StringFilter } from "react3l-advanced-filters";
import AdvanceIdFilter from "react3l-ui-library/build/components/AdvanceFilter/AdvanceIdFilter";
import AdvanceNumberFilter from "react3l-ui-library/build/components/AdvanceFilter/AdvanceNumberFilter";
/* end general import */
/* begin filter import */
import AdvanceStringFilter from "react3l-ui-library/build/components/AdvanceFilter/AdvanceStringFilter";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import { Reducer } from "redux";
/* end filter import */
/* begin individual import */
import { districtRepository } from "repositories/district-repository";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";

/* end individual import */

export interface DistrictFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
}

function DistrictAdvanceFilter(props: DistrictFilterProps) {
  const [translate] = useTranslation();

  const { visible, filter, setVisible, handleChangeAllFilter, handleClose } =
    props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<DistrictFilter, FilterAction<DistrictFilter>>
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
      payload: new DistrictFilter(),
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
          label={translate("districts.code")}
          showCount={true}
          maxLength={100}
          value={modelFilter["code"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "code",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("districts.placeholder.code")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("districts.name")}
          showCount={true}
          maxLength={100}
          value={modelFilter["name"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "name",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("districts.placeholder.name")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceNumberFilter
          label={translate("districts.priority")}
          value={modelFilter["priority"]["equal"]}
          onChange={handleChangeInputFilter({
            fieldName: "priority",
            fieldType: "equal",
            classFilter: NumberFilter,
          })}
          placeHolder={translate("districts.placeholder.priority")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          label={translate("districts.province")}
          value={modelFilter["provinceValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "province",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={ProvinceFilter}
          getList={districtRepository.filterListProvince}
          placeHolder={translate("districts.placeholder.province")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          label={translate("districts.status")}
          value={modelFilter["statusValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "status",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={StatusFilter}
          getList={districtRepository.filterListStatus}
          placeHolder={translate("districts.placeholder.status")}
        />
      </div>
    </Drawer>
  );
}

export default DistrictAdvanceFilter;
