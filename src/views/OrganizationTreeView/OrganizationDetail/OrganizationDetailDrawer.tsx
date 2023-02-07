/* begin general import */
import { Col, Row, Switch } from "antd";
import { ASSETS_SVG } from "config/consts";
import { Organization, OrganizationFilter } from "models/Organization";
import React from "react";
import { useTranslation } from "react-i18next";
import { TreeSelect } from "react3l-ui-library";
import Drawer, {
  DrawerProps,
} from "react3l-ui-library/build/components/Drawer/Drawer";
import FormItem from "react3l-ui-library/build/components/FormItem";
import InputText from "react3l-ui-library/build/components/Input/InputText";
import { organizationRepository } from "repositories/organization-repository";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
import { filterService } from "services/filter-service";
import { Status } from "models/Status";
import organizationDetailStyle from "./OrganizationDetail.module.scss";

interface OrganizationDetailDrawerProps extends DrawerProps {
  model: Organization;
  handleChangeSingleField?: (config: {
    fieldName: string;
  }) => (value: any) => void;
  handleChangeTreeField?: (config: {
    fieldName: string;
  }) => (values: any[], isMultiple: boolean) => void;
  handleChangeAllField?: (data: any) => void;
  loading?: boolean;
  currentNode?: Organization;
}

function OrganizationDetailDrawer(props: OrganizationDetailDrawerProps) {
  const [translate] = useTranslation();

  const {
    model,
    handleChangeTreeField,
    handleChangeSingleField,
    handleChangeAllField,
    loading,
    visible,
    handleSave,
    handleCancel,
  } = props;
  const [statusList] = filterService.useEnumList<Status>(
    organizationRepository.singleListStatus
  );
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
        newModel.status = statusList[1];
        newModel.statusId = statusList[1].id;
      } else {
        newModel.status = statusList[0];
        newModel.statusId = statusList[0].id;
      }
      handleChangeAllField(newModel);
    },
    [handleChangeAllField, model, statusList]
  );
  return (
    <Drawer
      {...props}
      size="lg"
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
                        label={translate("organizations.code")}
                        type={0}
                        isRequired
                        value={model.code}
                        placeHolder={translate(
                          "organizations.placeholder.code"
                        )}
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
                        isRequired
                        label={translate("organizations.name")}
                        type={0}
                        value={model.name}
                        placeHolder={translate(
                          "organizations.placeholder.name"
                        )}
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
                        nameof(model.address)
                      )}
                      message={model.errors?.address}
                    >
                      <InputText
                        label={translate("organizations.address")}
                        type={0}
                        value={model.address}
                        placeHolder={translate(
                          "organizations.placeholder.address"
                        )}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.address),
                        })}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.email)
                      )}
                      message={model.errors?.email}
                    >
                      <InputText
                        label={translate("organizations.email")}
                        type={0}
                        value={model.email}
                        placeHolder={translate(
                          "organizations.placeholder.email"
                        )}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.email),
                        })}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.phone)
                      )}
                      message={model.errors?.phone}
                    >
                      <InputText
                        label={translate("organizations.phone")}
                        type={0}
                        value={model.phone}
                        placeHolder={translate(
                          "organizations.placeholder.phone"
                        )}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.phone),
                        })}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.taxCode)
                      )}
                      message={model.errors?.taxCode}
                    >
                      <InputText
                        label={translate("organizations.taxCode")}
                        type={0}
                        value={model.taxCode}
                        placeHolder={translate(
                          "organizations.placeholder.taxCode"
                        )}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeSingleField({
                          fieldName: nameof(model.taxCode),
                        })}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        model,
                        nameof(model.parent)
                      )}
                      message={model.errors?.parent}
                    >
                      <TreeSelect
                        label={translate("organizations.parent")}
                        type={0}
                        placeHolder={translate(
                          "organizations.placeholder.parent"
                        )}
                        selectable={true}
                        classFilter={OrganizationFilter}
                        onChange={handleChangeTreeField({
                          fieldName: nameof(model.parent),
                        })}
                        checkStrictly={true}
                        getTreeData={
                          organizationRepository.singleListOrganization
                        }
                        item={model.parent}
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
                        <div
                          className={organizationDetailStyle["label-status"]}
                        >
                          {translate("organizations.status")}
                        </div>
                        <Switch
                          checked={model.statusId === 1 ? true : false}
                          onChange={handleChangeStatus}
                          className={organizationDetailStyle["switch_status"]}
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

export default OrganizationDetailDrawer;
