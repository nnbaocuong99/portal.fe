/* begin general import */
import {
  Add16,
  DocumentPdf16,
  Download16,
  OverflowMenuHorizontal16,
  SettingsAdjust16,
  TrashCan16,
  Upload16,
} from "@carbon/icons-react";
import { Dropdown, Menu, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { NATION_ROUTE } from "config/route-consts";
import { formatDate } from "helpers/date-time";
import { Nation, NationFilter } from "models/Nation";
import { Status, StatusFilter } from "models/Status";
import { Moment } from "moment";
import React, { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IdFilter } from "react3l-advanced-filters";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
  TagFilter,
} from "react3l-ui-library";
/* end general import */
/* begin filter import */
import AdvanceIdFilterMaster from "react3l-ui-library/build/components/AdvanceFilterMaster/AdvanceIdFilterMaster";
import InputSearch from "react3l-ui-library/build/components/Input/InputSearch";
/* end filter import */
/* begin individual import */
import { nationRepository } from "repositories/nation-repository";
import { detailService } from "services/detail-service";
import { filterService } from "services/filter-service";
import { importExportService } from "services/import-export-service";
import { listService } from "services/list-service";
import { masterService } from "services/master-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import NationDetailDrawer from "../NationDetail/NationDetailDrawer";
import NationAdvanceFilter from "./NationAdvanceFilter";
/* end individual import */

function NationMaster() {
  const [translate] = useTranslation();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    NationFilter,
    { skip: 0, take: 10 }
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  const importButtonRef: React.LegacyRef<HTMLInputElement> =
    useRef<HTMLInputElement>();

  const { handleListExport, handleExportTemplateList, loading } =
    importExportService.useExport();

  const {
    value: filter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    handleChangeInputSearch,
  } = filterService.useFilter(modelFilter, dispatch);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList(
      nationRepository.list,
      nationRepository.count,
      filter,
      handleChangeAllFilter
    );
  const { handleImportList } = importExportService.useImport(handleResetList);

  const { handleTableChange, handlePagination } = tableService.useTable(
    filter,
    handleChangeAllFilter
  );

  const {
    handleAction,
    handleBulkAction,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
  } = listService.useRowSelection(
    nationRepository.delete,
    nationRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
  );

  const { handleDeleteItem } = masterService.useMasterAction(
    NATION_ROUTE,
    handleAction
  );

  const {
    model,
    dispatch: dispatchModal,
    isOpenDetailModal,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleSaveModel,
    loadingModel,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
  } = detailService.useDetailModal(
    Nation,
    nationRepository.get,
    nationRepository.save,
    handleLoadList
  );

  const menuAction = React.useCallback(
    (id: number, nation: Nation) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu"
            onClick={() => handleOpenDetailModal(id)}
          >
            {translate("general.actions.view")}
          </div>
        </Menu.Item>
        <Menu.Item key="2">
          <div
            className="ant-action-menu"
            onClick={() => handleOpenDetailModal(id)}
          >
            {translate("general.actions.edit")}
          </div>
        </Menu.Item>
        {!nation.used && (
          <Menu.Item key="3">
            <div className="ant-action-menu" onClick={handleDeleteItem(nation)}>
              {translate("general.actions.delete")}
            </div>
          </Menu.Item>
        )}
      </Menu>
    ),
    [handleOpenDetailModal, handleDeleteItem, translate]
  );

  const columns: ColumnProps<Nation>[] = useMemo(
    () => [
      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "code"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("nations.code")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getAntOrderType<Nation, NationFilter>(
          filter,
          nameof(list[0].code)
        ),
        ellipsis: true,
        render(...params: [string, Nation, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "name"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("nations.name")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getAntOrderType<Nation, NationFilter>(
          filter,
          nameof(list[0].name)
        ),
        ellipsis: true,
        render(...params: [string, Nation, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "updatedAt"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("nations.updatedAt")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].updatedAt),
        dataIndex: nameof(list[0].updatedAt),
        sorter: true,
        sortOrder: getAntOrderType<Nation, NationFilter>(
          filter,
          nameof(list[0].updatedAt)
        ),
        ellipsis: true,
        render(...params: [Moment, Nation, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={formatDate(params[0])} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "status"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("nations.status")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        sortOrder: getAntOrderType<Nation, NationFilter>(
          filter,
          nameof(list[0].status)
        ),
        ellipsis: true,
        render(status: Status) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <div
                className={
                  status?.id === 1
                    ? "status__icon-active m-r--sm"
                    : "status__icon-inactive m-r--sm"
                }
              />
              <OneLineText value={status.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader
            orderType="right"
            title={translate("general.actions.label")}
          />
        ),
        key: "action",
        dataIndex: nameof(list[0].id),
        fixed: "right",
        width: 80,
        align: "center",
        render(id: number, nation: Nation) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, nation)}
                trigger={["click"]}
                placement="bottom"
                arrow
              >
                <OverflowMenuHorizontal16 />
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [translate, list, filter, menuAction]
  );

  const handleCancel = React.useCallback(() => {
    setVisible(false);
  }, []);
  return (
    <>
      <Spin spinning={loading}>
        <div className="page-content">
          <PageHeader
            title={translate("nations.master.subHeader")}
            breadcrumbItems={[
              translate("nations.master.header"),
              translate("nations.master.subHeader"),
            ]}
          />
          <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
            <div className="page-master__title p-l--sm p-t--xs p-b--xs">
              {translate("nations.master.title")}
            </div>
            <div className="page-master__content">
              <div className="page-master__tag-filter">
                <TagFilter
                  value={filter}
                  translate={translate}
                  keyTranslate={" nations "}
                  handleChangeFilter={handleChangeAllFilter}
                  onClear={(value: any) => {
                    return 0;
                  }}
                />
              </div>
              {(!selectedRowKeys || selectedRowKeys?.length === 0) && (
                <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
                  <div className="page-master__filter d-flex align-items-center justify-content-start">
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="">
                        <AdvanceIdFilterMaster
                          value={filter[nameof(list[0].statusId)]["equal"]}
                          placeHolder={translate("nations.placeholder.status")}
                          classFilter={StatusFilter}
                          onChange={handleChangeSelectFilter({
                            fieldName: nameof(list[0].status),
                            fieldType: "equal",
                            classFilter: IdFilter,
                          })}
                          getList={nationRepository.filterListStatus}
                          title={translate("nations.status")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="page-master__filter-action-search d-flex align-items-center">
                    <Button
                      type="icon-only-ghost"
                      icon={<SettingsAdjust16 />}
                      onClick={() => setVisible(true)}
                      className="btn--xl"
                    />
                    <InputSearch
                      valueFilter={filter}
                      classFilter={NationFilter}
                      placeHolder={translate("general.placeholder.search")}
                      onChange={handleChangeInputSearch}
                    />
                  </div>

                  <div className="page-master__actions  d-flex align-items-center justify-content-start">
                    <div className="page-master__filter-action d-flex align-items-center">
                      <input
                        ref={importButtonRef}
                        type="file"
                        style={{ display: "none" }}
                        id="master-import"
                        onChange={handleImportList(nationRepository.import)}
                        onClick={() => {
                          importButtonRef.current.value = null;
                        }}
                      />
                      <Button
                        type="icon-only-ghost"
                        icon={<Download16 />}
                        onClick={handleListExport(
                          filter,
                          nationRepository.export
                        )}
                        className="btn--xl"
                      />
                      <Button
                        type="icon-only-ghost"
                        icon={<Upload16 />}
                        onClick={() => {
                          importButtonRef.current.click();
                        }}
                        className="btn--xl"
                      />
                      <Button
                        type="icon-only-ghost"
                        icon={<DocumentPdf16 />}
                        onClick={handleExportTemplateList(
                          nationRepository.exportTemplate
                        )}
                        className="btn--xl"
                      />
                      <Button
                        type="primary"
                        className="btn--lg"
                        icon={<Add16 />}
                        onClick={() => handleOpenDetailModal(null)}
                      >
                        {translate("general.actions.create")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="page-master__content-table">
              <ActionBarComponent
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
              >
                <Button
                  icon={<TrashCan16 />}
                  type="ghost-primary"
                  className="btn--lg"
                  disabled={!canBulkAction}
                  onClick={() => handleBulkAction(selectedRowKeys)}
                >
                  {translate("general.actions.delete")}
                </Button>
              </ActionBarComponent>
              <StandardTable
                rowKey={nameof(list[0].id)}
                columns={columns}
                dataSource={list}
                isDragable={true}
                tableSize={"md"}
                onChange={handleTableChange}
                loading={loadingList}
                rowSelection={rowSelection}
                scroll={{ x: 1500 }}
              />

              <Pagination
                skip={filter?.skip}
                take={filter?.take}
                total={count}
                onChange={handlePagination}
                canChangePageSize={false}
              />
            </div>
          </div>
        </div>
      </Spin>
      {visible && (
        <NationAdvanceFilter
          visible={visible}
          handleClose={handleCancel}
          visibleFooter={true}
          loading={false}
          size={"sm"}
          filter={filter}
          setVisible={setVisible}
          handleChangeAllFilter={handleChangeAllFilter}
        />
      )}
      <NationDetailDrawer
        model={model}
        visible={isOpenDetailModal}
        handleSave={handleSaveModel}
        handleCancel={handleCloseDetailModal}
        handleChangeSingleField={handleChangeSingleField}
        handleChangeSelectField={handleChangeSelectField}
        handleChangeDateField={handleChangeDateField}
        dispatch={dispatchModal}
        loading={loadingModel}
        visibleFooter={true}
      />
    </>
  );
}
export default NationMaster;
