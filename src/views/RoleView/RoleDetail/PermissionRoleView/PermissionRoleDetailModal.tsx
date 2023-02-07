/* begin general import */
import { Add16 } from "@carbon/icons-react";
import { Col, Row, Spin, Switch, Tabs } from "antd";
/* end general import */
/* begin individual import */
import { MenuFilter } from "models/Menu";
import { Permission } from "models/Permission";
import { Role } from "models/Role";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DatePicker,
  FormItem,
  InputText,
  Modal,
  Select,
} from "react3l-ui-library";
import { roleRepository } from "repositories/role-repository";
import { ModelAction } from "services/detail-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
import ContentTable from "../RoleContentTable/RoleContentTable";
import {
  usePermisionActionMappingHook,
  usePermisionContentHook,
} from "../RoleDetailHook/PermssionContentHook";
import permissionRoleDetailStyle from "./PermissionRoleDetail.module.scss";
/* end individual import */

const { TabPane } = Tabs;

interface PermissionRoleDetailModalProps {
  model: Permission;
  setModel?: (data: Permission) => void;
  onChangeSimpleField: (config: { fieldName: string }) => (value: any) => void;
  handleSave?: (value?: any) => void;
  dispatchModel?: React.Dispatch<ModelAction<Role>>;
  loading?: boolean;
  role?: Role;
  visible?: boolean;
  handleCancel?: () => void;
  visibleFooter?: boolean;
  siteId?: number;
}

function PermissionRoleDetailModal(props: PermissionRoleDetailModalProps) {
  const [translate] = useTranslation();

  const { model, onChangeSimpleField, loading, setModel, siteId } = props;

  const handleChangeStatus = React.useCallback(
    (checked) => {
      const newModel = { ...model };
      if (checked) {
        newModel.statusId = 1;
      } else {
        newModel.statusId = 0;
      }
      setModel(newModel);
    },
    [setModel, model]
  );
  const handleChangeMenu = React.useCallback(
    () => (idValue: number, value: any) => {
      const newModel = { ...model };
      newModel["menu"] = value;
      newModel["menuId"] = idValue;
      newModel["permissionContents"] = undefined;
      setModel(newModel);
    },
    [model, setModel]
  );
  const {
    filter: permissionActionFilter,
    permissionActionMappingList,
    loadPermissionActionMappingList,
    permissionActionMappingColumns,
    permissionActionMappingRowSelection,
  } = usePermisionActionMappingHook(model, setModel);
  const permissionActionMappingTable = React.useMemo(
    () => (
      <ContentTable
        model={model}
        filter={permissionActionFilter}
        list={permissionActionMappingList}
        loadingList={loadPermissionActionMappingList}
        handleAddContent={null}
        rowSelection={permissionActionMappingRowSelection}
        columns={permissionActionMappingColumns}
        isShowFooter={false}
      />
    ),
    [
      loadPermissionActionMappingList,
      model,
      permissionActionFilter,
      permissionActionMappingColumns,
      permissionActionMappingList,
      permissionActionMappingRowSelection,
    ]
  );
  const {
    permissionContentFilter,
    permissionContentList,
    loadPermissionContentList,
    handleAddPermissionContent,
    permissionContentColumns,
  } = usePermisionContentHook(model, setModel);

  const permissionContentTable = React.useMemo(
    () => (
      <ContentTable
        model={model}
        filter={permissionContentFilter}
        list={permissionContentList}
        loadingList={loadPermissionContentList}
        handleAddContent={handleAddPermissionContent}
        columns={permissionContentColumns}
        isShowFooter={false}
      />
    ),
    [
      handleAddPermissionContent,
      loadPermissionContentList,
      model,
      permissionContentColumns,
      permissionContentFilter,
      permissionContentList,
    ]
  );
  return (
    <Modal
      {...props}
      width={1200}
      titleButtonCancel={translate("general.actions.close")}
      titleButtonApply={translate("general.actions.save")}
    >
      {loading && (
        <div className="loading-block">
          <Spin size="large" />
        </div>
      )}

      <div className={permissionRoleDetailStyle["permission_tabs"]}>
        <div className="page__modal-header w-100">
          <Row className="d-flex">
            <Col
              lg={24}
              className={`${permissionRoleDetailStyle["permission-role-detail_header_tile"]} page__modal-header-title`}
            >
              {model?.id ? (
                <div className="page__title mr-1">
                  {translate("permissions.detail.title")}
                </div>
              ) : (
                translate("permissions.detail.create")
              )}
            </Col>
          </Row>
        </div>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab={translate("permissions.titleInfor")}>
            <Row>
              <Col lg={12} className="m-b--xxs p-r--sm  p-l--xxxs">
                <FormItem
                  validateStatus={utilService.getValidateStatus(
                    model,
                    nameof(model.code)
                  )}
                  message={model.errors?.code}
                >
                  <InputText
                    isRequired
                    label={translate("permissions.code")}
                    type={0}
                    value={model.code}
                    placeHolder={translate("permissions.placeholder.code")}
                    className={"tio-account_square_outlined"}
                    onChange={onChangeSimpleField({
                      fieldName: nameof(model.code),
                    })}
                  />
                </FormItem>
              </Col>
              <Col lg={12} className="m-b--xxs p-r--sm">
                <FormItem
                  validateStatus={utilService.getValidateStatus(
                    model,
                    nameof(model.name)
                  )}
                  message={model.errors?.name}
                >
                  <InputText
                    isRequired
                    label={translate("permissions.name")}
                    value={model.name}
                    type={0}
                    placeHolder={translate("permissions.placeholder.name")}
                    className={"tio-account_square_outlined"}
                    onChange={onChangeSimpleField({
                      fieldName: nameof(model.name),
                    })}
                  />
                </FormItem>
              </Col>

              <Col lg={12} className="m-b--xxs p-r--sm p-l--xxxs">
                <FormItem
                  validateStatus={utilService.getValidateStatus(
                    model,
                    nameof(model.startAt)
                  )}
                  message={model.errors?.startAt}
                >
                  <DatePicker
                    label={translate("permissions.startAt")}
                    value={model.startAt}
                    type={0}
                    onChange={onChangeSimpleField({
                      fieldName: nameof(model.startAt),
                    })}
                    placeHolder={translate("permissions.placeholder.startAt")}
                  />
                </FormItem>
              </Col>
              <Col lg={12} className="m-b--xxs p-r--sm">
                <FormItem
                  validateStatus={utilService.getValidateStatus(
                    model,
                    nameof(model.endAt)
                  )}
                  message={model.errors?.endAt}
                >
                  <DatePicker
                    label={translate("permissions.endAt")}
                    value={model.endAt}
                    type={0}
                    onChange={onChangeSimpleField({
                      fieldName: nameof(model.endAt),
                    })}
                    placeHolder={translate("permissions.placeholder.endAt")}
                  />
                </FormItem>
              </Col>
              <Col lg={12} className="m-b--xxs p-r--sm p-l--xxxs">
                <FormItem
                  validateStatus={utilService.getValidateStatus(
                    model,
                    nameof(model.menu)
                  )}
                  message={model.errors?.menu}
                >
                  <Select
                    isRequired
                    type={0}
                    label={translate("permissions.menu")}
                    classFilter={MenuFilter}
                    placeHolder={translate("permissions.placeholder.menu")}
                    getList={roleRepository.singleListMenu}
                    onChange={handleChangeMenu()}
                    valueFilter={{
                      ...new MenuFilter(),
                      siteId: { equal: siteId },
                    }}
                    value={model.menu}
                    appendToBody={true}
                  />
                </FormItem>
              </Col>
              <Col lg={12} className="m-b--xxs p-r--sm">
                <FormItem
                  validateStatus={utilService.getValidateStatus(
                    model,
                    nameof(model.status)
                  )}
                  message={model.errors?.status}
                >
                  <div>
                    <div className="label-status">
                      {translate("permissions.status")}
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
          </TabPane>
          {model.menuId ? (
            <>
              <TabPane key="2" tab={translate("permissions.field")}>
                <Row className="role-content-table">
                  {permissionContentTable}
                </Row>
                <Row>
                  <div className="action__container mt-2">
                    <Button
                      type="primary"
                      className="btn--lg"
                      icon={<Add16 />}
                      onClick={handleAddPermissionContent}
                    >
                      {translate("general.button.add")}
                    </Button>
                  </div>
                </Row>
              </TabPane>
              <TabPane key="3" tab={translate("permissions.action")}>
                <Row
                  className={
                    permissionRoleDetailStyle["role-content-table-action"]
                  }
                >
                  {permissionActionMappingTable}
                </Row>
              </TabPane>
            </>
          ) : (
            <></>
          )}
        </Tabs>
      </div>
    </Modal>
  );
}

export default PermissionRoleDetailModal;
