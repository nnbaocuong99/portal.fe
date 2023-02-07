import { Col, Row } from "antd";
import { ColumnProps } from "antd/lib/table/Column";
import { TFunction } from "i18next";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Organization } from "models/Organization";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import {
  AdvanceStringFilter,
  LayoutCell,
  LayoutHeader,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";
import { organizationRepository } from "repositories/organization-repository";
import { finalize, forkJoin } from "rxjs";
import { webService } from "services/web-service";
import nameof from "ts-nameof.macro";

export function useOrganizationAppUserHook(
  model: Organization,
  setModel: Dispatch<SetStateAction<Organization>>,
  handleGetDetail: (filter: AppUserFilter) => void,
  filterAppUserTable: AppUserFilter
) {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [subscription] = webService.useSubscription();
  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter()
  );
  const [list, setList] = React.useState<AppUser[]>([]);
  const [total, setTotal] = React.useState<number>(undefined);
  const [loading, setLoading] = React.useState<boolean>();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<KeyType[]>([]);
  const [selectedList, setSelectedList] = React.useState<AppUser[]>([]);

  React.useEffect(() => {
    if (model?.appUsers && model?.appUsers?.length > 0) {
      const list: any[] = [];
      model?.appUsers.forEach((item: AppUser) => {
        list.push(item?.id);
      });
      setSelectedRowKeys([...list]);
    } else setSelectedRowKeys([]);
  }, [model?.appUsers]);

  const rowSelection = useMemo(
    () => ({
      onChange(selectedRowKeys: KeyType[], selectedRows: AppUser[]) {
        setSelectedList([...selectedRows]);
        setSelectedRowKeys(selectedRowKeys);
      },
      selectedRowKeys,
      type: "checkbox",
    }),
    [selectedRowKeys]
  );
  const handleGetItemList = React.useCallback(
    async (filterValue) => {
      setLoading(true);
      const getNCountItems = forkJoin([
        organizationRepository.listAppUser(filterValue),
        organizationRepository.countAppUser(filterValue),
      ])
        .pipe(
          finalize(() => {
            setLoading(false);
          })
        )
        .subscribe(
          (results: [AppUser[], number]) => {
            if (results[0]) {
              setList([...results[0]]);
              setTotal(Number(results[1]));
            }
          },
          (errors: any) => {}
        );
      subscription.add(getNCountItems);
    },
    [subscription]
  );

  const handleOpenModal = React.useCallback(
    () => (event: any) => {
      const list: any[] = [];
      if (model?.appUsers && model?.appUsers?.length > 0) {
        model?.appUsers.forEach((item: AppUser) => {
          list.push(item?.id);
        });
      }

      handleGetItemList({ ...new AppUserFilter(), id: { notIn: list } });
      setAppUserFilter({ ...new AppUserFilter(), id: { notIn: list } });

      setVisible(true);
    },
    [model?.appUsers, handleGetItemList]
  );
  const handleCloseModal = React.useCallback(() => {
    setVisible(false);
  }, []);
  const handleSave = React.useCallback(() => {
    if (selectedList && selectedList.length > 0) {
      model.appUsers = [...selectedList];
      organizationRepository.update(model).subscribe((res) => {
        handleGetDetail(filterAppUserTable);
        setModel(res);
        handleCloseModal();
      });
    }
  }, [
    filterAppUserTable,
    handleCloseModal,
    handleGetDetail,
    model,
    selectedList,
    setModel,
  ]);

  const handleFilter = React.useCallback(
    (fieldName: string, filterType: string) => {
      return (value: any) => {
        const newFilter = { ...appUserFilter };
        newFilter[fieldName][filterType] = value;
        handleGetItemList(newFilter);
      };
    },
    [appUserFilter, handleGetItemList]
  );

  const handleChangePagination = React.useCallback(
    (skip: number, take: number) => {
      const filterValue = { ...appUserFilter };
      filterValue["skip"] = skip;
      filterValue["take"] = take;
      setAppUserFilter({ ...filterValue });

      handleGetItemList(filterValue);
    },
    [appUserFilter, handleGetItemList]
  );

  return {
    visible,
    list,
    total,
    appUserFilter,
    loading,
    handleOpenModal,
    handleSave,
    handleCloseModal,
    handleChangePagination,
    handleFilter,
    // handleTableChange,
    rowSelection,
  };
}
interface OrganizationAppUserMappingModalProps {
  visible: boolean;
  handleClose: () => void;
  handleSave: (data: Organization) => void;
  translate: TFunction;
  appUserFilter?: AppUserFilter;
  handleChangeInputFilter?: (
    fieldFilter: string,
    filterType: string
  ) => (value?: any) => void;
  listAppUser?: AppUser[];
  countAppUser?: number;
  loadList?: boolean;
  handleTableChange?: (value: any) => void;
  handlePagination?: (skip: number, take: number) => void;
  rowSelection?: any;
}
export function OrganizationAppUserMappingModal(
  props: OrganizationAppUserMappingModalProps
) {
  const {
    visible,
    handleSave,
    handleClose,
    translate,
    appUserFilter,
    handleChangeInputFilter,
    listAppUser,
    countAppUser,
    loadList,
    handleTableChange,
    handlePagination,
    rowSelection,
  } = props;

  const columns: ColumnProps<AppUser>[] = useMemo(
    () => [
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("organizations.appUsers.username")}
          />
        ),
        key: nameof(listAppUser[0].username),
        dataIndex: nameof(listAppUser[0].username),

        ellipsis: true,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("organizations.appUsers.displayName")}
          />
        ),
        key: nameof(listAppUser[0].displayName),
        dataIndex: nameof(listAppUser[0].displayName),

        ellipsis: true,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("organizations.appUsers.email")}
          />
        ),
        key: nameof(listAppUser[0].email),
        dataIndex: nameof(listAppUser[0].email),
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("organizations.appUsers.phone")}
          />
        ),
        key: nameof(listAppUser[0].phone),
        dataIndex: nameof(listAppUser[0].phone),
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, listAppUser]
  );
  return (
    <>
      <Modal
        size="lg"
        visibleFooter={true}
        visible={visible}
        title={translate("organizations.appUsers.title")}
        handleSave={handleSave}
        handleCancel={handleClose}
        titleButtonCancel={translate("general.actions.close")}
        titleButtonApply={translate("general.actions.save")}
      >
        <div className="modal-content">
          <Row>
            <Col lg={6} className="m-b--xxs p-r--sm">
              <div className="d-flex m-t--sm">
                <AdvanceStringFilter
                  label={translate("organizations.appUsers.username")}
                  showCount={true}
                  maxLength={100}
                  value={appUserFilter["username"]["contain"]}
                  onChange={handleChangeInputFilter("username", "contain")}
                  placeHolder={translate(
                    "organizations.appUsers.placeholder.username"
                  )}
                />
              </div>
            </Col>
            <Col lg={6} className="m-b--xxs p-r--sm">
              <div className="d-flex m-t--sm">
                <AdvanceStringFilter
                  label={translate("organizations.appUsers.displayName")}
                  showCount={true}
                  maxLength={100}
                  value={appUserFilter["displayName"]["contain"]}
                  onChange={handleChangeInputFilter("displayName", "contain")}
                  placeHolder={translate(
                    "organizations.appUsers.placeholder.displayName"
                  )}
                />
              </div>
            </Col>
            <Col lg={6} className="m-b--xxs p-r--sm">
              <div className="d-flex m-t--sm">
                <AdvanceStringFilter
                  label={translate("organizations.appUsers.email")}
                  showCount={true}
                  maxLength={100}
                  value={appUserFilter["email"]["contain"]}
                  onChange={handleChangeInputFilter("email", "contain")}
                  placeHolder={translate(
                    "organizations.appUsers.placeholder.email"
                  )}
                />
              </div>
            </Col>
            <Col lg={6} className="m-b--xxs p-r--sm">
              <div className="d-flex m-t--sm">
                <AdvanceStringFilter
                  label={translate("organizations.appUsers.phone")}
                  showCount={true}
                  maxLength={100}
                  value={appUserFilter["phone"]["contain"]}
                  onChange={handleChangeInputFilter("phone", "contain")}
                  placeHolder={translate(
                    "organizations.appUsers.placeholder.phone"
                  )}
                />
              </div>
            </Col>
          </Row>
          <div className=" m-t--sm">
            <StandardTable
              rowKey={nameof(listAppUser[0].id)}
              columns={columns}
              dataSource={listAppUser}
              isDragable={true}
              tableSize={"md"}
              onChange={handleTableChange}
              loading={loadList}
              rowSelection={rowSelection}
            />
            <Pagination
              skip={appUserFilter?.skip}
              take={appUserFilter?.take}
              total={countAppUser}
              onChange={handlePagination}
              canChangePageSize={false}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
