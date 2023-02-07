/* begin general import */
import { Add16, TrashCan16 } from "@carbon/icons-react";
import { Col, Popconfirm, Row } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { AxiosError } from "axios";
import { TFunction } from "i18next";
/* end general import */
/* begin individual import */
import { AppUser } from "models/AppUser";
import { AppUserRoleMapping } from "models/AppUserRoleMapping";
import { Role, RoleFilter } from "models/Role";
import React, { useCallback, useState } from "react";
import { Model } from "react3l-common";
import { Button, FormItem, Modal, Select } from "react3l-ui-library";
import { appUserRepository } from "repositories/app-user-repository";
import appMessageService from "services/app-message-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
/* end individual import */

export function useAppUserRoleMappingHook(setLoadList: () => void): {
  visibleRole: boolean;
  appUser: AppUser;
  handleOpenRoleView: (id: number) => void;
  handleCloseRoleView: () => void;
  handleSaveRole: (selected: Role) => void;
} {
  const [appUser, setAppUser] = useState<AppUser>(new AppUser());
  const [visibleRole, setVisibleRole] = useState<boolean>(false);
  const handleOpenRoleView = useCallback((id: number) => {
    appUserRepository.get(id).subscribe((user) => {
      setAppUser(user);
      setVisibleRole(true);
    });
  }, []);
  const handleCloseRoleView = React.useCallback(() => {
    setVisibleRole(false);
  }, []);

  const { notifyUpdateItemSuccess, notifyUpdateItemError } =
    appMessageService.useCRUDMessage();

  const handleSaveRole = useCallback(
    (list) => {
      if (appUser?.appUserRoleMappings) {
        if (list && list?.length > 0) {
          const listRoleIds = list.map((role: Role) => role.id);
          const usedRoleIds = appUser.appUserRoleMappings.map(
            (content) => content.roleId
          );
          list.forEach((i: Role) => {
            const content = new AppUserRoleMapping();
            content.role = i;
            content.roleId = i?.id;
            if (appUser.appUserRoleMappings.length > 0) {
              // add unused role
              if (!usedRoleIds.includes(i.id)) {
                appUser.appUserRoleMappings.push(content);
              }
            } else {
              appUser.appUserRoleMappings.push(content);
            }
          });
          // remove content which used removed role
          const newContents = appUser.appUserRoleMappings.filter((content) =>
            listRoleIds.includes(content.roleId)
          );
          appUser.appUserRoleMappings = newContents;
          setAppUser(appUser);
        } else {
          // if no store selected, remove all contents
          appUser.appUserRoleMappings = [];
          setAppUser({
            ...appUser,
          });
        }
        appUserRepository.updateRole(appUser).subscribe(
          (item) => {
            setAppUser({ ...item });
            setTimeout(() => {
              notifyUpdateItemSuccess();
            }, 0);
            setVisibleRole(false);
            setLoadList();
          },
          (error: AxiosError<AppUser>) => {
            if (error.response && error.response.status === 400) {
              notifyUpdateItemError();
            }
          }
        );
      }
    },
    [appUser, notifyUpdateItemError, notifyUpdateItemSuccess, setLoadList]
  );
  return {
    visibleRole,
    appUser,
    handleOpenRoleView,
    handleCloseRoleView,
    handleSaveRole,
  };
}

interface AppUserRoleMappingViewProps<T extends Model> {
  model?: T;
  isOpenRoleModel?: boolean;
  isLoadingPreview?: boolean;
  handleCloseRoleModel?: () => void;
  onSave?: (selectedList: Role[]) => void;
  translate?: TFunction;
}

export function AppUserRoleMappingView(
  props: AppUserRoleMappingViewProps<AppUser>
) {
  const { model, isOpenRoleModel, handleCloseRoleModel, onSave, translate } =
    props;
  const [role, setRole] = React.useState<Role>(undefined);
  const [selectedList, setSelectedList] = React.useState<Role[]>([]);
  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>(
    new RoleFilter()
  );
  const ref = React.useRef<boolean>(true);

  React.useEffect(() => {
    if (isOpenRoleModel) {
      if (ref.current) {
        if (
          model?.appUserRoleMappings &&
          model?.appUserRoleMappings.length > 0
        ) {
          const selected = model?.appUserRoleMappings.map(
            (item: Role) => item?.role
          );
          setSelectedList(selected);
          const ids = selected.map((role) => role.id);
          roleFilter.id.notIn = ids;
          setRoleFilter({ ...roleFilter });
          ref.current = false;
        } else {
          setSelectedList([]);
          ref.current = false;
        }
      }
    } else {
      ref.current = true;
    }
  }, [isOpenRoleModel, model?.appUserRoleMappings, roleFilter]);
  const hanldeChangeMappingRole = React.useCallback((valueId, valueObject) => {
    setRole(valueObject);
  }, []);

  const handleAddRole = React.useCallback(() => {
    if (role?.id !== undefined) {
      const ids = selectedList.map((role) => role.id);
      if (!ids.includes(role.id)) {
        selectedList.push(role);
        setSelectedList([...selectedList]);
      }
      roleFilter.id.notIn = ids;
      setRoleFilter({ ...roleFilter });
      setRole(undefined);
    }
  }, [role, selectedList, roleFilter]);

  const handleDeleteItem = React.useCallback(
    (index: number) => {
      if (index > -1) {
        selectedList.splice(index, 1);
      }
      setSelectedList([...selectedList]);
      setRole(undefined);
    },
    [selectedList]
  );

  const handleSave = React.useCallback(() => {
    if (typeof onSave === "function") {
      setRole(undefined);
      onSave(selectedList);
    }
  }, [onSave, selectedList]);

  const columns: ColumnProps<Role>[] = React.useMemo(() => {
    return [
      {
        title: (
          <div className="text-left gradient-text">
            {translate("appUsers.roles.code")}
          </div>
        ),
        key: nameof(selectedList[0].code),
        dataIndex: nameof(selectedList[0].code),
        width: 150,
        ellipsis: true,
      },
      {
        title: (
          <div className="text-left gradient-text">
            {translate("appUsers.roles.name")}
          </div>
        ),
        width: 150,

        key: nameof(selectedList[0].name),
        dataIndex: nameof(selectedList[0].name),
        ellipsis: true,
      },
      {
        title: (
          <div className="text-center gradient-text">
            {translate("general.actions.label")}
          </div>
        ),
        key: "action",
        dataIndex: nameof(selectedList[0].id),
        fixed: "right",
        width: 80,
        align: "center",
        render(...[, , index]) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Popconfirm
                placement="top"
                title={translate("general.delete.content")}
                onConfirm={() => handleDeleteItem(index)}
                okText={translate("general.actions.delete")}
                cancelText={translate("general.actions.cancel")}
              >
                <button className="btn btn-sm ">
                  <TrashCan16 color="red" />
                </button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }, [handleDeleteItem, selectedList, translate]);
  const handleClose = React.useCallback(() => {
    setRoleFilter(new RoleFilter());
    handleCloseRoleModel();
  }, [handleCloseRoleModel]);

  return (
    <>
      <Modal
        size="lg"
        visible={isOpenRoleModel}
        visibleFooter={true}
        handleSave={handleSave}
        handleCancel={handleClose}
        titleButtonCancel={translate("general.actions.close")}
        titleButtonApply={translate("general.actions.save")}
        className="m-t--sm"
        title={translate("appUsers.addRole")}
      >
        <div className="modal-content">
          <Row className="d-flex justify-content-between align-items-center m-t--xs">
            <Col lg={14}>
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  model,
                  nameof(model.status)
                )}
                message={model.errors?.status}
              >
                <Select
                  type={0}
                  classFilter={RoleFilter}
                  searchProperty={"name"}
                  placeHolder={translate("appUsers.placeholder.role")}
                  getList={appUserRepository.singleListRole}
                  onChange={hanldeChangeMappingRole}
                  value={role}
                  valueFilter={{ ...new RoleFilter(), siteId: { equal: 1 } }}
                />
              </FormItem>
            </Col>
            <Col>
              <Button
                type="primary"
                className="btn--lg"
                icon={<Add16 />}
                onClick={handleAddRole}
              >
                {translate("general.actions.addRole")}
              </Button>
            </Col>
          </Row>
          <Row>
            <Table
              key={selectedList[0]?.id}
              tableLayout="fixed"
              columns={columns}
              dataSource={selectedList}
              pagination={false}
              rowKey={nameof(selectedList[0].id)}
              className=" m-t--xs"
              scroll={{ y: 300 }}
            />
          </Row>
        </div>
      </Modal>
    </>
  );
}

export default AppUserRoleMappingView;
