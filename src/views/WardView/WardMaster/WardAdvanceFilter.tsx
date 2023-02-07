/* begin general import */
import { DistrictFilter } from "models/District";
import { ProvinceFilter } from "models/Province";
import { StatusFilter } from "models/Status";
import { WardFilter } from "models/Ward";
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
import { wardRepository } from "repositories/ward-repository";
import {
  FilterAction,
  filterReducer,
  filterService,
} from "services/filter-service";

/* end individual import */

export interface WardFilterProps extends DrawerProps {
  filter?: any;
  setVisible?: any;
  handleChangeAllFilter?: (data: any) => void;
  dispatch?: any;
}

function WardAdvanceFilter(props: WardFilterProps) {
  const [translate] = useTranslation();
  const {
    visible,
    filter,
    setVisible,
    handleChangeAllFilter,
    handleClose,
  } = props;

  const [modelFilter, setModelFilter] = React.useReducer<
    Reducer<WardFilter, FilterAction<WardFilter>>
  >(filterReducer, filter);

  const { handleChangeInputFilter, handleChangeSelectFilter } =
    filterService.useFilter(filter, setModelFilter);

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter()
  );

  const [selectedProvince, setSelectedProvince] = React.useState();
  const [idProvince, setIdProvince] = React.useState();

  const handleChangeProvince = React.useCallback(
    (id, item) => {
      if (id && item) {
        setIdProvince(id);
        setSelectedProvince(item);
        districtFilter.provinceId.equal = id;
        setDistrictFilter(districtFilter);
      }
    },
    [districtFilter]
  );

  const handleSaveModelFilter = React.useCallback(() => {
    setVisible(false);
    const newFilter = { ...modelFilter };
    newFilter.provinceId.equal = idProvince;
    newFilter.provinceValue = selectedProvince;
    handleChangeAllFilter(newFilter);
  }, [handleChangeAllFilter, idProvince, modelFilter, selectedProvince, setVisible]);

  const handleClearModelFilter = React.useCallback(() => {
    setModelFilter({
      type: 0,
      payload: new WardFilter(),
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
          label={translate("wards.code")}
          showCount={true}
          maxLength={100}
          value={modelFilter["code"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "code",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("wards.placeholder.code")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceStringFilter
          label={translate("wards.name")}
          showCount={true}
          maxLength={100}
          value={modelFilter["name"]["contain"]}
          onChange={handleChangeInputFilter({
            fieldName: "name",
            fieldType: "contain",
            classFilter: StringFilter,
          })}
          placeHolder={translate("wards.placeholder.name")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceNumberFilter
          label={translate("wards.priority")}
          value={modelFilter["priority"]["equal"]}
          onChange={handleChangeInputFilter({
            fieldName: "priority",
            fieldType: "equal",
            classFilter: NumberFilter,
          })}
          placeHolder={translate("wards.placeholder.priority")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          label={translate("wards.province")}
          value={selectedProvince}
          onChange={handleChangeProvince}
          classFilter={ProvinceFilter}
          getList={wardRepository.filterListProvince}
          placeHolder={translate("wards.placeholder.province")}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          label={translate("wards.district")}
          value={modelFilter["districtValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "district",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={DistrictFilter}
          getList={wardRepository.filterListDistrict}
          placeHolder={translate("wards.placeholder.district")}
          valueFilter={districtFilter}
        />
      </div>

      <div className="d-flex m-t--sm">
        <AdvanceIdFilter
          label={translate("wards.status")}
          value={modelFilter["statusValue"]}
          onChange={handleChangeSelectFilter({
            fieldName: "status",
            fieldType: "equal",
            classFilter: IdFilter,
          })}
          classFilter={StatusFilter}
          getList={wardRepository.filterListStatus}
          placeHolder={translate("wards.placeholder.status")}
        />
      </div>
    </Drawer>
  );
}

export default WardAdvanceFilter;
