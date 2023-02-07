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
import { DISTRICT_ROUTE } from "config/route-consts";
import { formatNumber } from "helpers/number";
import { District, DistrictFilter } from "models/District";
import { Province, ProvinceFilter } from "models/Province";
import { Status, StatusFilter } from "models/Status";
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
import { districtRepository } from "repositories/district-repository";
import { detailService } from "services/detail-service";
import { filterService } from "services/filter-service";
import { importExportService } from "services/import-export-service";
import { listService } from "services/list-service";
import { masterService } from "services/master-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import DistrictDetailDrawer from "../DistrictDetail/DistrictDetailDrawer";
import DistrictAdvanceFilter from "./DistrictAdvanceFilter";
/* end individual import */

function DistrictMaster() {
  const [translate] = useTranslation();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    DistrictFilter,
    { skip: 0, take: 10 }
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  const importButtonRef: React.LegacyRef<HTMLInputElement> =
    useRef<HTMLInputElement>();

  const {
    value: filter,
    handleChangeSelectFilter,
    handleChangeAllFilter,
    handleChangeInputSearch,
  } = filterService.useFilter(modelFilter, dispatch);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList(
      districtRepository.list,
      districtRepository.count,
      filter,
      handleChangeAllFilter
    );

  const { handleImportList } = importExportService.useImport(handleResetList);

  const { handleListExport, handleExportTemplateList, loading } =
    importExportService.useExport();

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
    districtRepository.delete,
    districtRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
  );

  const { handleDeleteItem } = masterService.useMasterAction(
    DISTRICT_ROUTE,
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
    District,
    districtRepository.get,
    districtRepository.save,
    handleLoadList
  );

  const menuAction = React.useCallback(
    (id: number, district: District) => (
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
        {!district.used && (
          <Menu.Item key="3">
            <div
              className="ant-action-menu"
              onClick={handleDeleteItem(district)}
            >
              {translate("general.actions.delete")}
            </div>
          </Menu.Item>
        )}
      </Menu>
    ),
    [handleOpenDetailModal, handleDeleteItem, translate]
  );

  const columns: ColumnProps<District>[] = useMemo(
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
                title={translate("districts.code")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },

        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getAntOrderType<District, DistrictFilter>(
          filter,
          nameof(list[0].code)
        ),
        ellipsis: true,
        render(...params: [string, District, number]) {
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
                title={translate("districts.name")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getAntOrderType<District, DistrictFilter>(
          filter,
          nameof(list[0].name)
        ),
        ellipsis: true,
        render(...params: [string, District, number]) {
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
            ({ column }) => column.key === "province"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("districts.province")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].province),
        dataIndex: nameof(list[0].province),
        sorter: true,
        sortOrder: getAntOrderType<District, DistrictFilter>(
          filter,
          nameof(list[0].province)
        ),
        ellipsis: true,
        render(province: Province) {
          return (
            //fill the render field after generate code;
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={province.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "priority"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("districts.priority")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].priority),
        dataIndex: nameof(list[0].priority),
        sorter: true,
        sortOrder: getAntOrderType<District, DistrictFilter>(
          filter,
          nameof(list[0].priority)
        ),
        ellipsis: true,
        render(...params: [number, District, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={formatNumber(params[0])} />
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
                title={translate("districts.status")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        sorter: true,
        sortOrder: getAntOrderType<District, DistrictFilter>(
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
        render(id: number, district: District) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, district)}
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
            title={translate("districts.master.subHeader")}
            breadcrumbItems={[
              translate("districts.master.header"),
              translate("districts.master.subHeader"),
            ]}
          />
          <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
            <div className="page-master__title p-l--sm p-t--xs p-b--xs">
              {translate("districts.master.title")}
            </div>
            <div className="page-master__content">
              <div className="page-master__tag-filter">
                <TagFilter
                  value={filter}
                  translate={translate}
                  keyTranslate={" districts "}
                  handleChangeFilter={handleChangeAllFilter}
                  onClear={(value: any) => {
                    return 0;
                  }}
                />
              </div>
              {(!selectedRowKeys || selectedRowKeys?.length === 0) && (
                <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
                  <div className="page-master__filter d-flex align-items-center justify-content-start">
                    <div className="">
                      <AdvanceIdFilterMaster
                        value={filter[nameof(list[0].provinceId)]["equal"]}
                        placeHolder={translate(
                          "districts.placeholder.province"
                        )}
                        classFilter={ProvinceFilter}
                        onChange={handleChangeSelectFilter({
                          fieldName: nameof(list[0].province),
                          fieldType: "equal",
                          classFilter: IdFilter,
                        })}
                        getList={districtRepository.filterListProvince}
                        title={translate("districts.province")}
                      />
                    </div>
                    <div className="">
                      <AdvanceIdFilterMaster
                        value={filter[nameof(list[0].statusId)]["equal"]}
                        placeHolder={translate("districts.placeholder.status")}
                        classFilter={StatusFilter}
                        onChange={handleChangeSelectFilter({
                          fieldName: nameof(list[0].status),
                          fieldType: "equal",
                          classFilter: IdFilter,
                        })}
                        getList={districtRepository.filterListStatus}
                        title={translate("districts.status")}
                      />
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
                      classFilter={DistrictFilter}
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
                        onChange={handleImportList(districtRepository.import)}
                        onClick={() => {
                          importButtonRef.current.value = null;
                        }}
                      />
                      <Button
                        type="icon-only-ghost"
                        icon={<Download16 />}
                        onClick={handleListExport(
                          filter,
                          districtRepository.export
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
                          districtRepository.exportTemplate
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
        <DistrictAdvanceFilter
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
      <DistrictDetailDrawer
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
export default DistrictMaster;
