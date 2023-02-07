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
import { Dropdown, Menu } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { THEME_ROUTE } from "config/route-consts";
import { Theme, ThemeFilter } from "models/Theme";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import InputSearch from "react3l-ui-library/build/components/Input/InputSearch";
/* end filter import */
/* begin individual import */
import { themeRepository } from "repositories/theme-repository";
import { detailService } from "services/detail-service";
import { filterService } from "services/filter-service";
import { importExportService } from "services/import-export-service";
import { listService } from "services/list-service";
import { masterService } from "services/master-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import ThemeDetailDrawer from "../ThemeDetail/ThemeDetailDrawer";
import ThemeAdvanceFilter from "./ThemeAdvanceFilter";
/* end individual import */

function ThemeMaster() {
  const [translate] = useTranslation();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    ThemeFilter,
    { skip: 0, take: 10 }
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  const importButtonRef: React.LegacyRef<HTMLInputElement> =
    React.useRef<HTMLInputElement>();

  const { handleImportList } = importExportService.useImport();

  const { handleListExport, handleExportTemplateList } =
    importExportService.useExport();

  const {
    value: filter,
    handleChangeInputSearch,
    handleChangeAllFilter,
  } = filterService.useFilter(modelFilter, dispatch);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList(
      themeRepository.list,
      themeRepository.count,
      filter,
      handleChangeAllFilter
    );

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
    themeRepository.delete,
    themeRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
  );

  const { handleDeleteItem } = masterService.useMasterAction(
    THEME_ROUTE,
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
  } = detailService.useDetailModal(
    Theme,
    themeRepository.get,
    themeRepository.save,
    handleLoadList
  );

  const menuAction = React.useCallback(
    (id: number, theme: Theme) => (
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
        <Menu.Item key="3">
          <div className="ant-action-menu" onClick={handleDeleteItem(theme)}>
            {translate("general.actions.delete")}
          </div>
        </Menu.Item>
      </Menu>
    ),
    [handleOpenDetailModal, handleDeleteItem, translate]
  );

  const columns: ColumnProps<Theme>[] = useMemo(
    () => [
      {
        title: (
          <LayoutHeader orderType="left" title={translate("themes.code")} />
        ),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getAntOrderType<Theme, ThemeFilter>(
          filter,
          nameof(list[0].code)
        ),
        render(...params: [string, Theme, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: (
          <LayoutHeader orderType="left" title={translate("themes.name")} />
        ),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getAntOrderType<Theme, ThemeFilter>(
          filter,
          nameof(list[0].name)
        ),
        render(...params: [string, Theme, number]) {
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
            orderType="right"
            title={translate("general.actions.label")}
          />
        ),
        key: "action",
        dataIndex: nameof(list[0].id),
        fixed: "right",
        width: 150,
        align: "center",
        render(id: number, theme: Theme) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, theme)}
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
      <div className="page-content">
        <PageHeader
          title={translate("themes.master.subHeader")}
          breadcrumbItems={[
            translate("themes.master.header"),
            translate("themes.master.subHeader"),
          ]}
        />
        <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--xs p-b--xs">
            {translate("themes.master.title")}
          </div>
          <div className="page-master__content">
            <div className="page-master__tag-filter">
              <TagFilter
                value={filter}
                translate={translate}
                keyTranslate={" themes "}
                handleChangeFilter={handleChangeAllFilter}
                onClear={(value: any) => {
                  return 0;
                }}
              />
            </div>
            {(!selectedRowKeys || selectedRowKeys?.length === 0) && (
              <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
                <div className="page-master__filter d-flex align-items-center justify-content-start"></div>
                <div className="page-master__filter-action-search d-flex align-items-center">
                  <Button
                    type="icon-only-ghost"
                    icon={<SettingsAdjust16 />}
                    onClick={() => setVisible(true)}
                    className="btn--xl"
                  />
                  <InputSearch
                    valueFilter={filter}
                    classFilter={ThemeFilter}
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
                      onChange={handleImportList(themeRepository.import)}
                      onClick={() => {
                        importButtonRef.current.value = null;
                      }}
                    />
                    <Button
                      type="icon-only-ghost"
                      icon={<Download16 />}
                      onClick={handleListExport(filter, themeRepository.export)}
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
                        themeRepository.exportTemplate
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
      {visible && (
        <ThemeAdvanceFilter
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
      <ThemeDetailDrawer
        model={model}
        visible={isOpenDetailModal}
        handleSave={handleSaveModel}
        handleCancel={handleCloseDetailModal}
        handleChangeSingleField={handleChangeSingleField}
        handleChangeSelectField={handleChangeSelectField}
        dispatch={dispatchModal}
        loading={loadingModel}
        visibleFooter={true}
      />
    </>
  );
}
export default ThemeMaster;
