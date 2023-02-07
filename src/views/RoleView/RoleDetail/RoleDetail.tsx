/* begin general import */
import { Add16, Close16, Send16, SettingsAdjust16 } from "@carbon/icons-react";
import { Col, Row, Switch } from "antd";
import PageHeader from "components/PageHeader/PageHeader";
/* end general import */
/* begin individual import */
import { ROLE_ROUTE } from "config/route-consts";
import { Role, RoleFilter } from "models/Role";
import { SiteFilter } from "models/Site";
import React from "react";
import { useTranslation } from "react-i18next";
import { IdFilter } from "react3l-advanced-filters";
import {
  Button,
  DatePicker,
  FormItem,
  InputText,
  Select,
  TagFilter,
} from "react3l-ui-library";
import InputSearch from "react3l-ui-library/build/components/Input/InputSearch";
import { roleRepository } from "repositories/role-repository";
import appMessageService from "services/app-message-service";
import { detailService } from "services/detail-service";
import { fieldService } from "services/field-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
import PermissionRoleDetail from "./PermissionRoleView/PermissionRoleDetail";
import RoleContentModal from "./RoleContentModal/RoleContentModal";
import RoleContentTable from "./RoleContentTable/RoleContentTable";
import "./RoleDetail.scss";
import AppUserRoleAdvanceFilter from "./RoleDetailHook/AppUserRoleAdvanceFilter";
import {
  appUserRoleMappingContentMapper,
  useAppUserRoleMappingModal,
  useAppUserRoleMappingTable,
} from "./RoleDetailHook/AppUserRoleMappingHook";
/* end individual import */

function RoleDetail() {
  const [translate] = useTranslation();
  const [visible, setVisible] = React.useState<boolean>(false);

  const handleCancel = React.useCallback(() => {
    setVisible(false);
  }, []);
  const url = document.URL;

  const isLinkAssginAppUser = React.useMemo(() => {
    let isCheck: boolean = false;
    if (url.includes("assign-app-user")) {
      isCheck = true;
    }
    return isCheck;
  }, [url]);

  const { model, dispatch } = detailService.useModel<Role>(Role);

  const { isDetail } = detailService.useGetIsDetail<Role>(
    roleRepository.get,
    dispatch
  );

  const {
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
  } = fieldService.useField(model, dispatch);

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
    detailService.useActionsDetail<Role>(
      model,
      roleRepository.save,
      handleChangeAllField,
      ROLE_ROUTE
    );

  const { notifyUpdateItemSuccess, notifyUpdateItemError } =
    appMessageService.useCRUDMessage();
  const handleAssignAppUser = React.useCallback(
    (model) => {
      roleRepository.assignAppUser(model).subscribe(
        (item: Role) => {
          notifyUpdateItemSuccess();
          handleGoMaster();
        },
        (err) => {
          notifyUpdateItemError();
        }
      );
    },
    [handleGoMaster, notifyUpdateItemError, notifyUpdateItemSuccess]
  );
  const {
    appUserContentFilter,
    appUserRoleMappings,
    appUserRoleMappingList,
    setAppUserRoleMappings,
    appUserRoleMappingColumns,
    loadAppUserRoleMappingList,
    appUserRoleMappingTotal,
    handleAddAppUserRoleMapping,
    handleAppUserRoleMappingTableChange,
    handleAppUserRoleMappingPagination,
    canBulkDeleteAppUserRoleMapping,
    handleLocalBulkDeleteAppUserRoleMapping,
    handleSearchAppUserRoleMapping,
    handleChangeAllAppUserRoleMappingFilter,
    handleChangeAppUserRoleMappingSelectFilter,
  } = useAppUserRoleMappingTable(model, handleChangeAllField);
  const {
    visibleAppUser,
    appUserFilter,
    handleUpdateNewAppUserFilter,
    handleSearchAppUser,
    handleResetAppUserFilter,
    loadAppUserList,
    setLoadAppUserList,
    appUserModalFilters,
    handleOpenAppUserModal,

    handleCloseAppUserModal,
    handleSaveAppUserModal,
    selectedAppUserList,
    appUserColumns,
  } = useAppUserRoleMappingModal(
    appUserRoleMappings,
    handleSearchAppUserRoleMapping
  );
  const appUserRoleMappingModal = React.useMemo(
    () => (
      <RoleContentModal
        content={appUserRoleMappings}
        width={1200}
        setContent={setAppUserRoleMappings}
        visible={visibleAppUser}
        filter={appUserFilter}
        onUpdateNewFilter={handleUpdateNewAppUserFilter}
        onResetFilter={() => handleResetAppUserFilter}
        onSearch={handleSearchAppUser}
        getList={roleRepository.listAppUser}
        getTotal={roleRepository.countAppUser}
        loadList={loadAppUserList}
        setLoadList={setLoadAppUserList}
        selectedList={selectedAppUserList}
        columns={appUserColumns}
        filterList={appUserModalFilters}
        mapperField={nameof(model.appUserRoleMappings[0].appUser)}
        mapper={appUserRoleMappingContentMapper}
        onClose={handleCloseAppUserModal}
        onSave={handleSaveAppUserModal}
        title={
          <div className="page-detail__title ">
            {translate("roles.titles.filterAppUser")}
          </div>
        }
      />
    ),
    [
      appUserRoleMappings,
      setAppUserRoleMappings,
      visibleAppUser,
      appUserFilter,
      handleUpdateNewAppUserFilter,
      handleResetAppUserFilter,
      handleSearchAppUser,
      loadAppUserList,
      setLoadAppUserList,
      selectedAppUserList,
      appUserColumns,
      appUserModalFilters,
      model,
      handleCloseAppUserModal,
      handleSaveAppUserModal,
      translate,
    ]
  );

  const appUserRoleMappingTable = React.useMemo(
    () => (
      <RoleContentTable
        model={model}
        filter={appUserContentFilter}
        list={appUserRoleMappingList}
        loadingList={loadAppUserRoleMappingList}
        total={appUserRoleMappingTotal}
        handleTableChange={handleAppUserRoleMappingTableChange}
        handleLocalBulkDelete={handleLocalBulkDeleteAppUserRoleMapping}
        canBulkDelete={canBulkDeleteAppUserRoleMapping}
        handlePagination={handleAppUserRoleMappingPagination}
        handleAddContent={handleAddAppUserRoleMapping}
        columns={appUserRoleMappingColumns}
        onOpenModal={handleOpenAppUserModal}
        isShowTitle={false}
      />
    ),
    [
      appUserContentFilter,
      appUserRoleMappingColumns,
      appUserRoleMappingList,
      appUserRoleMappingTotal,
      canBulkDeleteAppUserRoleMapping,
      handleAddAppUserRoleMapping,
      handleAppUserRoleMappingPagination,
      handleAppUserRoleMappingTableChange,
      handleLocalBulkDeleteAppUserRoleMapping,
      handleOpenAppUserModal,
      loadAppUserRoleMappingList,
      model,
    ]
  );

  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("roles.master.subHeader")}
          breadcrumbItems={[
            translate("roles.master.header"),
            translate("roles.master.subHeader"),
          ]}
        />
        <div className="page page-detail p-t--lg p-l--xxl p-r--xxl p-b--lg">
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
                  nameof(model.code)
                )}
                message={model.errors?.code}
              >
                <InputText
                  isRequired
                  label={translate("roles.code")}
                  type={0}
                  value={model.code}
                  placeHolder={translate("roles.placeholder.code")}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.code),
                  })}
                  disabled={isLinkAssginAppUser ? true : false}
                />
              </FormItem>
            </Col>
            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.name)
                )}
                message={model.errors?.name}
              >
                <InputText
                  isRequired
                  label={translate("roles.name")}
                  type={0}
                  value={model.name}
                  placeHolder={translate("roles.placeholder.name")}
                  className={"tio-account_square_outlined"}
                  onChange={handleChangeSingleField({
                    fieldName: nameof(model.name),
                  })}
                  disabled={isLinkAssginAppUser ? true : false}
                />
              </FormItem>
            </Col>

            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.site)
                )}
                message={model.errors?.site}
              >
                <Select
                  isRequired
                  label={translate("roles.site")}
                  type={0}
                  classFilter={SiteFilter}
                  placeHolder={translate("roles.placeholder.site")}
                  getList={roleRepository.singleListSite}
                  onChange={handleChangeSelectField({
                    fieldName: nameof(model.site),
                  })}
                  value={model.site}
                />
              </FormItem>
            </Col>
            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.startAt)
                )}
                message={model.errors?.startAt}
              >
                <DatePicker
                  label={translate("roles.startAt")}
                  value={model.startAt}
                  type={0}
                  onChange={handleChangeDateField({
                    fieldName: nameof(model.startAt),
                  })}
                  placeHolder={translate("roles.placeholder.startAt")}
                />
              </FormItem>
            </Col>
            <Col lg={6} className="m-b--xxs p-r--sm">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.endAt)
                )}
                message={model.errors?.endAt}
              >
                <DatePicker
                  label={translate("roles.endAt")}
                  value={model.endAt}
                  type={0}
                  onChange={handleChangeDateField({
                    fieldName: nameof(model.endAt),
                  })}
                  placeHolder={translate("roles.placeholder.endAt")}
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
                    {translate("roles.status")}
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

          {isLinkAssginAppUser ? (
            <>
              <div className="page-detail__title p-t--md">
                {translate("roles.assignAppUserList")}
              </div>
              {isDetail && (
                <div className="page-content permission-role-detai_content_table">
                  <div className="page page-master m-t--lg m-b--lg">
                    <div className="page-master__content">
                      <div className="page-master__tag-filter">
                        <TagFilter
                          value={appUserContentFilter}
                          translate={translate}
                          keyTranslate={"roles"}
                          handleChangeFilter={
                            handleChangeAllAppUserRoleMappingFilter
                          }
                          onClear={(value: any) => {
                            return 0;
                          }}
                        />
                      </div>
                      <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
                        <div className="page-master__filter d-flex align-items-center justify-content-start">
                          <div className="page-master__filter-action-search d-flex align-items-center">
                            <Button
                              type="icon-only-ghost"
                              icon={<SettingsAdjust16 />}
                              onClick={() => setVisible(true)}
                              className="btn--xl"
                            />
                            <InputSearch
                              valueFilter={appUserContentFilter}
                              classFilter={RoleFilter}
                              placeHolder={translate(
                                "general.placeholder.search"
                              )}
                              onChangeSearchField={handleChangeAppUserRoleMappingSelectFilter(
                                {
                                  fieldName: "search",
                                  fieldType: "",
                                  classFilter: IdFilter,
                                }
                              )}
                            />
                          </div>
                        </div>

                        <div className="page-master__actions  d-flex align-items-center justify-content-start">
                          <div className="page-master__filter-action d-flex align-items-center">
                            <Button
                              type="primary"
                              className="btn--lg"
                              icon={<Add16 />}
                              onClick={handleOpenAppUserModal}
                            >
                              {translate("roles.buttons.addAppUser")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="page-master__content-table">
                      {appUserRoleMappingTable}
                      {visibleAppUser && appUserRoleMappingModal}
                    </div>
                    {visible && (
                      <AppUserRoleAdvanceFilter
                        visible={visible}
                        handleClose={handleCancel}
                        visibleFooter={true}
                        loading={false}
                        size={"sm"}
                        filter={appUserContentFilter}
                        setVisible={setVisible}
                        handleChangeAllFilter={
                          handleChangeAllAppUserRoleMappingFilter
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {isDetail && (
                <>
                  <div className="page-detail__title p-t--md">
                    {isDetail && translate("roles.general.permission")}
                  </div>
                  <PermissionRoleDetail role={model} />
                </>
              )}
            </>
          )}
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
                onClick={
                  isLinkAssginAppUser
                    ? () => handleAssignAppUser(model)
                    : handleSaveModel
                }
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

export default RoleDetail;
