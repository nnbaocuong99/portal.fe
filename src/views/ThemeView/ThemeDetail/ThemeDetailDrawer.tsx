/* begin general import */
import { Col, Row } from "antd";
import { ASSETS_SVG } from "config/consts";
import { Theme } from "models/Theme";
import { Moment } from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { Model } from "react3l-common";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import FormItem from "react3l-ui-library/build/components/FormItem";
/* end general import */
/* begin individual import */
import InputText from "react3l-ui-library/build/components/Input/InputText";
import { ModelAction } from "services/detail-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";

/* end individual import */

interface ThemeDetailDrawerProps extends DrawerProps {
  model: Theme;
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
  dispatch?: React.Dispatch<ModelAction<Theme>>;
  loading?: boolean;
}

function ThemeDetailDrawer(props: ThemeDetailDrawerProps) {
  const [translate] = useTranslation();

  const {
    model,
    handleChangeSingleField,

    loading,
    visible,
    handleSave,
    handleCancel,
  } = props;

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
      titleButtonApply={translate("general.actions.apply")}
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
                  <Col lg={12} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.code)
                      )}
                      message={model.errors?.code}
                    >
                      <InputText
                        label={translate("themes.code")}
                        type={0}
                        value={model.code}
                        placeHolder={translate("themes.placeholder.code")}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.code),
                        })}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={12} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.name)
                      )}
                      message={model.errors?.name}
                    >
                      <InputText
                        label={translate("themes.name")}
                        type={0}
                        value={model.name}
                        placeHolder={translate("themes.placeholder.name")}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.name),
                        })}
                      />
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

export default ThemeDetailDrawer;
