/* begin general import */
import { Col, Row, Switch } from "antd";
import { ASSETS_SVG } from "config/consts";
import { Site } from "models/Site";
import { Moment } from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { Model } from "react3l-common";
import { Select, UploadImage } from "react3l-ui-library";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import FormItem from "react3l-ui-library/build/components/FormItem";
import InputText from "react3l-ui-library/build/components/Input/InputText";
import { siteRepository } from "repositories/site-repository";
import { ModelAction, ModelActionEnum } from "services/detail-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
/* end individual import */
import { GithubPicker } from "react-color";
import {
  File,
  UPLOADTYPE_IMAGE,
} from "react3l-ui-library/build/components/UploadImage/UploadImage";
import { SiteTypeFilter } from "models/SiteType";

interface SiteDetailDrawerProps extends DrawerProps {
  model: Site;
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
  dispatch?: React.Dispatch<ModelAction<Site>>;
  loading?: boolean;
}

function SiteDetailDrawer(props: SiteDetailDrawerProps) {
  const [translate] = useTranslation();

  const {
    model,
    dispatch,
    handleChangeSingleField,
    handleChangeSelectField,
    loading,
    visible,
    handleSave,
    handleCancel,
  } = props;

  const handleChangeColorGithub = React.useCallback(
    (color) => {
      color ? (model.colorCode = color.hex) : (model.colorCode = " ");
      dispatch({
        type: ModelActionEnum.UPDATE,
        payload: {
          [model.colorCode]: color,
        },
      });
    },
    [dispatch, model]
  );

  const handleChangeColorCode = React.useCallback(
    (e) => {
      e ? (model.colorCode = e) : (model.colorCode = " ");
      dispatch({
        type: ModelActionEnum.UPDATE,
        payload: {
          [model.colorCode]: e,
        },
      });
    },
    [dispatch, model]
  );
  const handleChangeImage = React.useCallback(
    (fieldName) => {
      return (file: File) => {
        handleChangeSingleField({ fieldName })(file.url);
      };
    },
    [handleChangeSingleField]
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
      titleButtonCancel={translate("general.actions.close")}
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
                        label={translate("sites.code")}
                        type={0}
                        value={model.code}
                        placeHolder={translate("sites.placeholder.code")}
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
                        label={translate("sites.name")}
                        type={0}
                        value={model.name}
                        placeHolder={translate("sites.placeholder.name")}
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
                        nameof(model.siteType)
                      )}
                      message={model.errors?.district}
                    >
                      <Select
                        isRequired={true}
                        label={translate("sites.siteType")}
                        type={0}
                        classFilter={SiteTypeFilter}
                        searchProperty={"name"}
                        placeHolder={translate("sites.placeholder.siteType")}
                        getList={siteRepository.singleListSiteType}
                        onChange={handleChangeSelectField({
                          fieldName: nameof(model.siteType),
                        })}
                        value={model.siteType}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.description)
                      )}
                      message={model.errors?.description}
                    >
                      <InputText
                        label={translate("sites.description")}
                        type={0}
                        value={model.description}
                        placeHolder={translate("sites.placeholder.description")}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.description),
                        })}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.colorCode)
                      )}
                      message={model.errors?.colorCode}
                    >
                      <InputText
                        label={translate("sites.colorCode")}
                        type={0}
                        value={model.colorCode}
                        placeHolder={translate("sites.placeholder.colorCode")}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeColorCode}
                      />
                    </FormItem>
                  </Col>

                  <Col>
                    <FormItem>
                      <span className="label-input mr-3">
                        <GithubPicker
                          color={model.colorCode || ""}
                          onChange={handleChangeColorGithub}
                        />
                      </span>
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.lightIcon)
                      )}
                      message={model.errors?.lightIcon}
                    >
                      <div className="input-text__wrapper tio-account_square_outlined">
                        <div className="input-text__label m-b--xxxs">
                          <label className="component__title">
                            {translate("sites.icon")}
                          </label>
                          <span style={{ width: "100%" }}></span>
                        </div>
                        <UploadImage
                          uploadAvatar={siteRepository.saveImage}
                          currentAvatar={{ url: model.lightIcon }}
                          type={UPLOADTYPE_IMAGE.AVATAR}
                          updateAvatar={handleChangeImage("lightIcon")}
                          className="avatar-xl"
                        />
                      </div>
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.darkIcon)
                      )}
                      message={model.errors?.darkIcon}
                    >
                      <div className="input-text__wrapper tio-account_square_outlined">
                        <div className="input-text__label m-b--xxxs">
                          <label className="component__title">
                            {translate("sites.colorfulIcon")}
                          </label>
                          <span style={{ width: "100%" }}></span>
                        </div>
                        <UploadImage
                          uploadAvatar={siteRepository.saveImage}
                          currentAvatar={{ url: model.darkIcon }}
                          type={UPLOADTYPE_IMAGE.AVATAR}
                          updateAvatar={handleChangeImage("darkIcon")}
                          className="avatar-xl"
                        />
                      </div>
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.lightLogo)
                      )}
                      message={model.errors?.lightLogo}
                    >
                      <div className="input-text__wrapper tio-account_square_outlined">
                        <div className="input-text__label m-b--xxxs">
                          <label className="component__title">
                            {translate("sites.logo")}
                          </label>
                          <span style={{ width: "100%" }}></span>
                        </div>
                        <UploadImage
                          uploadAvatar={siteRepository.saveImage}
                          currentAvatar={{ url: model.logo }}
                          type={UPLOADTYPE_IMAGE.AVATAR}
                          updateAvatar={handleChangeImage("lightLogo")}
                          className="avatar-xl"
                        />
                      </div>
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.darkLogo)
                      )}
                      message={model.errors?.darkLogo}
                    >
                      <div className="input-text__wrapper tio-account_square_outlined">
                        <div className="input-text__label m-b--xxxs">
                          <label className="component__title">
                            {translate("sites.colorfulLogo")}
                          </label>
                          <span style={{ width: "100%" }}></span>
                        </div>
                        <UploadImage
                          uploadAvatar={siteRepository.saveImage}
                          currentAvatar={{ url: model.darkLogo }}
                          type={UPLOADTYPE_IMAGE.AVATAR}
                          updateAvatar={handleChangeImage("darkLogo")}
                          className="avatar-xl"
                        />
                      </div>
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.isDisplay)
                      )}
                      message={model.errors?.isDisplay}
                    >
                      <div className="input-text__wrapper tio-account_square_outlined">
                        <div className="input-text__label m-b--xxxs">
                          <label className="component__title">
                            {translate("sites.isDisplay")}
                          </label>
                          <span style={{ width: "100%" }}></span>
                        </div>
                        <div>
                          {model.code !== "/landing-page" && (
                            <Switch
                              defaultChecked
                              checked={model.isDisplay}
                              onChange={handleChangeSingleField({
                                fieldName: nameof(model.isDisplay),
                              })}
                            />
                          )}
                        </div>
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

export default SiteDetailDrawer;
