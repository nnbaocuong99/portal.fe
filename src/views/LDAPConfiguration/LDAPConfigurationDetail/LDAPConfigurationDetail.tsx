/* begin general import */
import { Send16 } from "@carbon/icons-react";
import { Col, Row } from "antd";
import PageHeader from "components/PageHeader/PageHeader";
import { LDAP_CONFIGURATION_ROUTE } from "config/route-consts";
import { LDAPConfiguration } from "models/LDAPConfiguration";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react3l-ui-library";
import FormItem from "react3l-ui-library/build/components/FormItem";
import InputText from "react3l-ui-library/build/components/Input/InputText";
import { ldapConfigurationRepository } from "repositories/ldap-configuration-repository";
import { detailService, ModelActionEnum } from "services/detail-service";
import { fieldService } from "services/field-service";
import { utilService } from "services/util-service";
import { webService } from "services/web-service";
import nameof from "ts-nameof.macro";

/* end individual import */

function LDAPConfigurationDetail() {
  const [translate] = useTranslation();
  const { model, dispatch } =
    detailService.useModel<LDAPConfiguration>(LDAPConfiguration);
  const [subscription] = webService.useSubscription();
  const { handleChangeAllField, handleChangeSingleField } =
    fieldService.useField(model, dispatch);
  const { handleSaveModel } = detailService.useActionsDetail<LDAPConfiguration>(
    model,
    ldapConfigurationRepository.update,
    handleChangeAllField,
    LDAP_CONFIGURATION_ROUTE
  );

  useEffect(() => {
    subscription.add(
      ldapConfigurationRepository.get().subscribe({
        next: (res) => dispatch({ type: ModelActionEnum.SET, payload: res }),
        error: (_err) => {},
      })
    );
  }, [dispatch, subscription]);

  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("ldapConfiguration.detail.title")}
          breadcrumbItems={[translate("ldapConfiguration.detail.title")]}
        />
        <div className="page page-detail p-t--lg p-l--xxl p-r--xxl p-b--lg">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model._CONNECTION_STRING)
                )}
                message={model.errors?._CONNECTION_STRING}
              >
                <InputText
                  label={translate("ldapConfiguration._CONNECTION_STRING")}
                  type={0}
                  value={model._CONNECTION_STRING}
                  placeHolder={translate(
                    "ldapConfiguration.placeholder._CONNECTION_STRING"
                  )}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model._CONNECTION_STRING),
                  })}
                  isRequired
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model._BASE_DN)
                )}
                message={model.errors?._BASE_DN}
              >
                <InputText
                  isRequired
                  label={translate("ldapConfiguration._BASE_DN")}
                  type={0}
                  value={model._BASE_DN}
                  placeHolder={translate(
                    "ldapConfiguration.placeholder._BASE_DN"
                  )}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model._BASE_DN),
                  })}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model._ADMIN_USERNAME)
                )}
                message={model.errors?._ADMIN_USERNAME}
              >
                <InputText
                  label={translate("ldapConfiguration._ADMIN_USERNAME")}
                  type={0}
                  value={model._ADMIN_USERNAME}
                  placeHolder={translate(
                    "ldapConfiguration.placeholder._ADMIN_USERNAME"
                  )}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model._ADMIN_USERNAME),
                  })}
                  isRequired
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--sm m-t--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model._ADMIN_PASSWORD)
                )}
                message={model.errors?._ADMIN_PASSWORD}
              >
                <InputText
                  label={translate("ldapConfiguration._ADMIN_PASSWORD")}
                  type={0}
                  value={model._ADMIN_PASSWORD}
                  placeHolder={translate(
                    "ldapConfiguration.placeholder._ADMIN_PASSWORD"
                  )}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model._ADMIN_PASSWORD),
                  })}
                  isRequired
                />
              </FormItem>
            </Col>
          </Row>
        </div>
        <footer className="app-footer">
          <div className="app-footer__full d-flex justify-content-end align-items-center">
            <div className="app-footer__actions d-flex justify-content-end">
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

export default LDAPConfigurationDetail;
