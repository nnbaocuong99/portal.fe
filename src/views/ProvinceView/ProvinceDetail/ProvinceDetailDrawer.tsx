/* begin general import */
import { Col, Row, Switch } from "antd";
import { ASSETS_SVG } from "config/consts";
import { Province } from "models/Province";
import { Status } from "models/Status";
import { Moment } from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { Model } from "react3l-common";
import { InputNumber } from "react3l-ui-library";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import FormItem from "react3l-ui-library/build/components/FormItem";
import InputText from "react3l-ui-library/build/components/Input/InputText";
import { provinceRepository } from "repositories/province-repository";
import { ModelAction } from "services/detail-service";
import { filterService } from "services/filter-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";

/* end individual import */

interface ProvinceDetailDrawerProps extends DrawerProps {
  model: Province;
  handleChangeSingleField?: (config: {
    fieldName: string;
  }) => (value: any) => void;
  handleChangeSelectField?: (config: {
    fieldName: string;
  }) => (idValue: number, value: Model) => void;
  handleChangeTreeField?: (config: {
    fieldName: string;
  }) => (values: any[], isMultiple: boolean) => void;
  handleChangeDateField?: (config: {
    fieldName: string | [string, string];
  }) => (date: Moment | [Moment, Moment]) => void;
  dispatch?: React.Dispatch<ModelAction<Province>>;
  loading?: boolean;
}

function ProvinceDetailDrawer(props: ProvinceDetailDrawerProps) {
  const [translate] = useTranslation();

  const {
    model,
    handleChangeSingleField,
    handleChangeSelectField,
    loading,
    visible,
    handleSave,
    handleCancel,
  } = props;

  const [statusList] = filterService.useEnumList<Status>(
    provinceRepository.singleListStatus
  );

  const handleChangeStatus = React.useCallback(
    (checked) => {
      let status = new Status();
      if (checked) {
        status = statusList[1];
      } else {
        status = statusList[0];
      }
      handleChangeSelectField({ fieldName: "status" })(status.id, status);
    },
    [handleChangeSelectField, statusList]
  );

  return (
    <Drawer
      {...props}
      visible={visible}
      handleSave={handleSave}
      handleCancel={handleCancel}
      handleClose={handleCancel}
      visibleFooter={true}
      title={
        model?.id
          ? translate("general.detail.title")
          : translate("general.actions.create")
      }
      titleButtonCancel={translate("general.actions.cancel")}
      titleButtonApply={translate("general.actions.save")}
    >
      {loading ? (
        <div className="loading-block">
          <img src={ASSETS_SVG + "/spinner.svg"} alt="Loading..." />
        </div>
      ) : (
        <div className="page page__detail">
          <div className="w-100 page__detail-tabs">
            <Row className="d-flex">
              <Col lg={24}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.code)
                      )}
                      message={model.errors?.code}
                    >
                      <InputText
                        isRequired={true}
                        label={translate("provinces.code")}
                        type={0}
                        value={model.code}
                        placeHolder={translate("provinces.placeholder.code")}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.code),
                        })}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.name)
                      )}
                      message={model.errors?.name}
                    >
                      <InputText
                        isRequired={true}
                        label={translate("provinces.name")}
                        type={0}
                        value={model.name}
                        placeHolder={translate("provinces.placeholder.name")}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.name),
                        })}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.priority)
                      )}
                      message={model.errors?.priority}
                    >
                      <InputNumber
                        label={translate("provinces.priority")}
                        type={0}
                        value={model.priority}
                        placeHolder={translate(
                          "provinces.placeholder.priority"
                        )}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.priority),
                        })}
                        numberType={"DECIMAL"}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.status)
                      )}
                      message={model.errors?.status}
                    >
                      <div>
                        <div className={"label-status"}>
                          {translate("provinces.status")}
                        </div>
                        <Switch
                          checked={model.statusId === 1 ? true : false}
                          onChange={handleChangeStatus}
                          className={"switch_status"}
                        />
                      </div>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default ProvinceDetailDrawer;
