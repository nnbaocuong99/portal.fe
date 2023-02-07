import {
  Add16,
  Add24,
  DocumentPdf16,
  Download16,
  Upload16,
  Search16,
} from "@carbon/icons-react";
import { Card, Col, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table/Column";
import PageHeader from "components/PageHeader/PageHeader";
import { AppUser } from "models/AppUser";
import { Organization, OrganizationFilter } from "models/Organization";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AdvanceEnumFilterMaster,
  AdvanceStringFilter,
  Button,
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";
import LayoutHeader from "react3l-ui-library/build/components/StandardTable/LayoutHeader";
import { organizationRepository } from "repositories/organization-repository";
import { finalize } from "rxjs";
import { filterService } from "services/filter-service";
import { importExportService } from "services/import-export-service";
import { queryStringService } from "services/query-string-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
import OrganizationDetailDrawer from "../OrganizationDetail/OrganizationDetailDrawer";
import OrganizationTree from "./OrganizationTree/OrganizationTree";
import "./OrganizationTreeMaster.scss";
import {
  OrganizationAppUserMappingModal,
  useOrganizationAppUserHook,
} from "./OrganizationTreeMasterHook/OrganizationAppUserMappingModel";
import { useOrganizationTreeMasterHook } from "./OrganizationTreeMasterHook/OrganizationTreeMasterHook";

function OrganizationTreeMaster() {
  const [translate] = useTranslation();
  const [modelFilter, dispatch] = queryStringService.useQueryString(
    OrganizationFilter,
    { skip: 0, take: 10 }
  );
  const [internalExpandedKeys, setInternalExpandedKeys] = React.useState<
    number[]
  >([]);
  const [isCallListStart, setIsCallListStart] = React.useState<boolean>(true);
  const [loadingTree, setLoadingTree] = React.useState<boolean>(false); // loading on tree
  const [loadingTable, setLoadingTable] = React.useState<boolean>(false); // loading on table
  const [listTree, setListTree] = React.useState<Organization[]>([]); // list is used to build tree
  const [treeDataList] = utilService.buildTree<Organization>(listTree);

  const listFilterType: any[] = React.useMemo(() => {
    return [
      {
        id: 1,
        name: translate("organizations.filter.all"),
      },
      {
        id: 2,
        name: translate("organizations.filter.parent"),
      },
      {
        id: 3,
        name: translate("organizations.filter.children"),
      },
    ];
  }, [translate]);

  const { value: filter } = filterService.useFilter(modelFilter, dispatch);

  // Load ra các node gốc ban đầu của tree folder bằng cách lọc theo level = 1
  React.useEffect(() => {
    if (isCallListStart) {
      setLoadingTree(true);
      organizationRepository
        .list({
          ...new OrganizationFilter(),
          level: { equal: 1 },
        })
        .pipe(finalize(() => setLoadingTree(false)))
        .subscribe((res) => {
          setListTree(res);
        });

      setIsCallListStart(false);
    }
  }, [isCallListStart]);

  const importButtonRef: React.LegacyRef<HTMLInputElement> =
    React.useRef<HTMLInputElement>();

  const { handleListExport, handleExportTemplateList, loading } =
    importExportService.useExport();

  const {
    isActive,
    currentNode,
    handleClickIconNode,
    handleClickTitleNode,
    onClickDeleteIcon,
    filterAppUserTable,
    handleTableChange,
    handlePagination,
    setCurrentNode,
    handleEnumFilter,
    isOpenDetailModal,
    loadingModel,
    handleOpenDetailModal,
    handleGoCreate,
    handleSaveModel,
    handleCloseDetailModal,
    model,
    handleChangeSingleField,
    handleChangeTreeField,
    handleChangeAllField,
    handleChangeTreeFilter,
    filterTree,
    pagination,
    listInTable,
    handleGetDetail,
    handleImportList,
  } = useOrganizationTreeMasterHook(
    translate,
    setListTree,
    loadingTable,
    loadingTree,
    setLoadingTable,
    setLoadingTree,
    listTree,
    internalExpandedKeys,
    setInternalExpandedKeys
  );

  const {
    visible,
    list: listMapping,
    loading: loadingAppUserModal,
    appUserFilter,
    total,
    handleOpenModal,
    handleSave,
    handleCloseModal,
    rowSelection,
    handleFilter,
    handleChangePagination,
  } = useOrganizationAppUserHook(
    currentNode,
    setCurrentNode,
    handleGetDetail,
    filterAppUserTable
  );
  const columns: ColumnProps<AppUser>[] = useMemo(
    () => [
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("organizations.appUsers.username")}
          />
        ),
        key: "username",
        dataIndex: "username",

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
        key: "displayName",
        dataIndex: "displayName",
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
        key: "email",
        dataIndex: "email",

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
        key: "phone",
        dataIndex: "phone",

        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );
  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("organizations.master.subHeader")}
          breadcrumbItems={[
            translate("organizations.master.header"),
            translate("organizations.master.subHeader"),
          ]}
        />
        <div className="page page-master organization__master m-t--lg m-l--sm m-r--xxl m-b--xxs p-t--lg">
          <Row>
            <Col lg={10} className="organization__card p-l--md p-r--md">
              <Card
                headStyle={{ fontWeight: "bold" }}
                style={{
                  borderRadius: "7px",
                }}
              >
                <div className="d-flex justify-content-between p-l--md p-r--md">
                  <div className="organization__card__title m-b--xxs">
                    {translate("organizations.master.title")}
                  </div>
                  <span
                    className="m-l--xxl"
                    onClick={handleGoCreate(undefined)}
                  >
                    <Add24 />
                  </span>
                </div>
                <div className="d-flex m-b--xxs">
                  <AdvanceStringFilter
                    value={filterTree["name"]["contain"]}
                    onEnter={handleChangeTreeFilter()}
                    placeHolder={translate("organizations.placeholder.name")}
                    disabled={loadingTable || loadingTree}
                    type={0}
                    prefix={<Search16 className="m-r--xxxs" />}
                  />
                </div>

                <OrganizationTree
                  tree={treeDataList}
                  onShowChildOfNode={handleClickIconNode}
                  onShowDataTable={handleClickTitleNode}
                  currentNode={currentNode}
                  setCurrentNode={setCurrentNode}
                  onAdd={handleGoCreate}
                  onEdit={handleOpenDetailModal}
                  onDelete={onClickDeleteIcon}
                  internalExpandedKeys={internalExpandedKeys}
                  setInternalExpandedKeys={setInternalExpandedKeys}
                  listTree={listTree}
                />
              </Card>
            </Col>
            <Col lg={14}>
              {currentNode?.id && isActive && (
                <Spin spinning={loading}>
                  <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
                    <div className="page-master__filter d-flex align-items-center justify-content-start">
                      <div className="">
                        <AdvanceEnumFilterMaster
                          value={filterAppUserTable["filterType"]["equal"]}
                          listItem={listFilterType}
                          onChange={handleEnumFilter}
                          title={translate("organizations.appUsers.filterType")}
                        />
                      </div>
                    </div>

                    <div className="page-master__actions  d-flex align-items-center justify-content-start">
                      <div className="page-master__filter-action d-flex align-items-center">
                        <input
                          ref={importButtonRef}
                          type="file"
                          style={{ display: "none" }}
                          id="master-import"
                          onChange={handleImportList()}
                          disabled={currentNode?.statusId !== 1}
                          onClick={() => {
                            importButtonRef.current.value = null;
                          }}
                        />
                        <Button
                          type="icon-only-ghost"
                          icon={<Download16 />}
                          onClick={handleListExport(
                            filter,
                            organizationRepository.export
                          )}
                          className="btn--xl"
                          disabled={currentNode?.statusId !== 1}
                        />
                        <Button
                          type="icon-only-ghost"
                          icon={<Upload16 />}
                          onClick={() => {
                            importButtonRef.current.click();
                          }}
                          disabled={currentNode?.statusId !== 1}
                          className="btn--xl"
                        />
                        <Button
                          type="icon-only-ghost"
                          icon={<DocumentPdf16 />}
                          onClick={handleExportTemplateList(
                            organizationRepository.exportTemplate
                          )}
                          disabled={currentNode?.statusId !== 1}
                          className="btn--xl"
                        />
                        <Button
                          type="primary"
                          className="btn--lg"
                          icon={<Add16 />}
                          disabled={
                            loadingTable ||
                            loadingTree ||
                            currentNode?.statusId !== 1
                          }
                          onClick={handleOpenModal()}
                        >
                          {translate("organizations.buttons.add")}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="page-master__content-table organization_app_user_table">
                    {listInTable && (
                      <>
                        <StandardTable
                          rowKey={nameof(listInTable[0].id)}
                          columns={columns}
                          dataSource={listInTable}
                          isDragable={true}
                          tableSize={"md"}
                          onChange={handleTableChange}
                          loading={loadingTable}
                          pagination={pagination}
                        />
                        <Pagination
                          skip={filterAppUserTable?.skip}
                          take={filterAppUserTable?.take}
                          total={listInTable.length ? listInTable.length : 0}
                          onChange={handlePagination}
                          canChangePageSize={false}
                        />
                      </>
                    )}
                  </div>
                </Spin>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <OrganizationAppUserMappingModal
        visible={visible}
        handleClose={handleCloseModal}
        handleSave={handleSave}
        handleChangeInputFilter={handleFilter}
        handlePagination={handleChangePagination}
        translate={translate}
        appUserFilter={appUserFilter}
        listAppUser={listMapping}
        countAppUser={total}
        loadList={loadingAppUserModal}
        // handleTableChange={handleTableChangeAppUser}
        rowSelection={rowSelection}
      />
      {isOpenDetailModal && (
        <OrganizationDetailDrawer
          model={model}
          currentNode={currentNode}
          visible={isOpenDetailModal}
          handleSave={handleSaveModel}
          handleCancel={handleCloseDetailModal}
          handleChangeSingleField={handleChangeSingleField}
          handleChangeTreeField={handleChangeTreeField}
          handleChangeAllField={handleChangeAllField}
          loading={loadingModel}
          visibleFooter={true}
        />
      )}
    </>
  );
}

export default OrganizationTreeMaster;
