/* begin general import */
import { Close16, Send16 } from "@carbon/icons-react";
import { Col, Row, Switch } from "antd";
import classNames from "classnames";
import PageHeader from "components/PageHeader/PageHeader";
import { APP_USER_ROUTE } from "config/route-consts";
import { AppUser } from "models/AppUser";
import { AppUserSiteMapping } from "models/AppUserSiteMapping";
import { OrganizationFilter } from "models/Organization";
import { SexFilter } from "models/Sex";
import { Site, SiteFilter } from "models/Site";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react3l-ui-library";
import DatePicker from "react3l-ui-library/build/components/Calendar/DatePicker/DatePicker";
import FormItem from "react3l-ui-library/build/components/FormItem";
import InputText from "react3l-ui-library/build/components/Input/InputText";
import Select from "react3l-ui-library/build/components/Select/SingleSelect/Select";
import TreeSelect from "react3l-ui-library/build/components/TreeSelect/TreeSelect";
import { appUserRepository } from "repositories/app-user-repository";
import { detailService, ModelActionEnum } from "services/detail-service";
import { fieldService } from "services/field-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
import "./AppUserDetail.scss";

/* end individual import */

function AppUserDetail() {
  const [translate] = useTranslation();

  const { model, dispatch } = detailService.useModel<AppUser>(AppUser);

  const { isDetail } = detailService.useGetIsDetail<AppUser>(
    appUserRepository.get,
    dispatch
  );

  const {
    handleChangeDateField,
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeTreeField,
    handleChangeSelectField,
  } = fieldService.useField(model, dispatch);
  const ref = React.useRef<boolean>(true);
  React.useEffect(() => {
    if (ref.current && !model?.id) {
      handleChangeAllField({ ...model, statusId: 1 });
      ref.current = false;
    }
  }, [model, handleChangeAllField]);

  const handleChangeStatus = React.useCallback(
    (checked) => {
      const newModel = { ...model };
      if (checked) {
        newModel.statusId = 1;
      } else {
        newModel.statusId = 0;
      }
      handleChangeAllField(newModel);
    },
    [handleChangeAllField, model]
  );
  const { handleSaveModel, handleGoMaster } =
    detailService.useActionsDetail<AppUser>(
      model,
      appUserRepository.save,
      handleChangeAllField,
      APP_USER_ROUTE
    );

  const [isSite, setIsSite] = React.useState<boolean>(true);
  const [appUserSiteMappings, setAppUserSiteMappings] = React.useState<
    AppUserSiteMapping[]
  >([]);

  React.useEffect(() => {
    if (!isDetail && isSite) {
      appUserRepository
        .listSite(new SiteFilter())
        .subscribe((mapping: Site[]) => {
          mapping.forEach((site: Site) => {
            appUserSiteMappings.push({
              ...new AppUserSiteMapping(),
              site,
              siteId: site?.id,
            });
          });
          setAppUserSiteMappings(appUserSiteMappings);
          dispatch({
            type: ModelActionEnum.UPDATE,
            payload: {
              appUserSiteMappings: appUserSiteMappings,
            } as AppUser,
          });
        });
      setIsSite(false);
    }
    if (isDetail && isSite) {
      if (model?.appUserSiteMappings && model?.appUserSiteMappings.length > 0) {
        const appUserSite: AppUserSiteMapping[] = model.appUserSiteMappings;
        setAppUserSiteMappings([...appUserSite]);
        setIsSite(false);
      }
    }
  }, [appUserSiteMappings, dispatch, isDetail, isSite, model]);

  const handleChangeSiteMapping = React.useCallback(
    (index) => {
      return (check: boolean) => {
        appUserSiteMappings[index].enabled = check;
        setAppUserSiteMappings([...appUserSiteMappings]);
        dispatch({
          type: ModelActionEnum.UPDATE,
          payload: {
            appUserSiteMappings: appUserSiteMappings,
          } as AppUser,
        });
      };
    },
    [appUserSiteMappings, dispatch]
  );

  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("appUsers.master.subHeader")}
          breadcrumbItems={[
            translate("appUsers.master.header"),
            translate("appUsers.master.subHeader"),
          ]}
        />
        <div className="page page-detail p-t--lg p-l--md p-r--sm p-b--lg">
          <div className="page-detail__title p-b--sm">
            {!isDetail
              ? translate("general.actions.create")
              : translate("general.detail.title")}
          </div>
          <Row>
            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.username)
                )}
                message={model.errors?.username}
              >
                <InputText
                  label={translate("appUsers.username")}
                  isRequired={true}
                  type={0}
                  value={model.username}
                  placeHolder={translate("appUsers.placeholder.username")}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.username),
                  })}
                />
              </FormItem>
            </Col>
            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.displayName)
                )}
                message={model.errors?.displayName}
              >
                <InputText
                  label={translate("appUsers.displayName")}
                  isRequired={true}
                  type={0}
                  value={model.displayName}
                  placeHolder={translate("appUsers.placeholder.displayName")}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.displayName),
                  })}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.birthday)
                )}
                message={model.errors?.birthday}
              >
                <DatePicker
                  label={translate("appUsers.birthday")}
                  value={model.birthday}
                  type={0}
                  onChange={handleChangeDateField({
                    fieldName: nameof(model.birthday),
                  })}
                  disabledDate={(current) => {
                    return current && current > moment().endOf("day");
                  }}
                  placeHolder={translate("appUsers.placeholder.birthday")}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs ">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.address)
                )}
                message={model.errors?.address}
              >
                <InputText
                  label={translate("appUsers.address")}
                  type={0}
                  value={model.address}
                  placeHolder={translate("appUsers.placeholder.address")}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.address),
                  })}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.email)
                )}
                message={model.errors?.email}
              >
                <InputText
                  label={translate("appUsers.email")}
                  isRequired={true}
                  type={0}
                  value={model.email}
                  placeHolder={translate("appUsers.placeholder.email")}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.email),
                  })}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.phone)
                )}
                message={model.errors?.phone}
              >
                <InputText
                  label={translate("appUsers.phone")}
                  isRequired={true}
                  type={0}
                  value={model.phone}
                  placeHolder={translate("appUsers.placeholder.phone")}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.phone),
                  })}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.organization)
                )}
                message={model.errors?.organization}
              >
                <TreeSelect
                  isRequired
                  label={translate("appUsers.organization")}
                  type={0}
                  placeHolder={translate("appUsers.placeholder.organization")}
                  selectable={true}
                  classFilter={OrganizationFilter}
                  onChange={handleChangeTreeField({
                    fieldName: nameof(model.organization),
                  })}
                  checkStrictly={true}
                  getTreeData={appUserRepository.singleListOrganization}
                  item={model.organization}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs ">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.sex)
                )}
                message={model.errors?.sex}
              >
                <Select
                  isRequired
                  label={translate("appUsers.sex")}
                  type={0}
                  classFilter={SexFilter}
                  searchProperty={"name"}
                  placeHolder={translate("appUsers.placeholder.sex")}
                  getList={appUserRepository.singleListSex}
                  onChange={handleChangeSelectField({
                    fieldName: nameof(model.sex),
                  })}
                  value={model.sex}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.status)
                )}
                message={model.errors?.status}
              >
                <div>
                  <div className="label-status">
                    {translate("appUsers.status")}
                  </div>
                  <Switch
                    checked={model.statusId === 1 ? true : false}
                    onChange={handleChangeStatus}
                    className="switch_status"
                  />
                </div>
              </FormItem>
            </Col>
          </Row>

          <Row className="d-flex flex-column">
            <div className="page-detail__title m-b--xs m-t--xxs">
              {translate("appUsers.sitePermission")}
            </div>
            {appUserSiteMappings.length > 0 &&
              appUserSiteMappings.map(
                (appUserSiteMapping: AppUserSiteMapping, index: number) => (
                  <div key={index}>
                    {appUserSiteMapping?.siteId !== 100 ? (
                      <div className="site-permission-item m-b--xxs d-flex">
                        <Col lg={3}>
                          <div
                            className={classNames("general-field__first-row", {
                              "app-user-detail-first-site": index === 0,
                            })}
                          >
                            {appUserSiteMapping?.site.name}
                          </div>
                        </Col>
                        <Col lg={2} className="switch-permisition m-l--xxs">
                          <Switch
                            checked={appUserSiteMapping.enabled === true}
                            onChange={handleChangeSiteMapping(index)}
                          />
                        </Col>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                )
              )}
          </Row>
        </div>
        <footer className="app-footer">
          <div className="app-footer__full d-flex justify-content-end align-items-center">
            <div className="app-footer__actions d-flex justify-content-end">
              <Button
                type="secondary"
                className="btn--lg"
                icon={<Close16 />}
                onClick={handleGoMaster}
              >
                {translate("general.actions.close")}
              </Button>
              <Button
                type="primary"
                className="btn--lg"
                icon={<Send16 />}
                onClick={handleSaveModel}
              >
                {translate("general.actions.save")}
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default AppUserDetail;
