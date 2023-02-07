/* begin general import */
import { OverflowMenuHorizontal16 } from "@carbon/icons-react";
import { Dropdown, Menu, Switch } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { Site, SiteFilter } from "models/Site";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
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
import { siteRepository } from "repositories/site-repository";
import appMessageService from "services/app-message-service";
import { detailService } from "services/detail-service";
import { filterService } from "services/filter-service";
import { listService } from "services/list-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType, tableService } from "services/table-service";
import nameof from "ts-nameof.macro";
import SiteDetailDrawer from "../SiteDetail/SiteDetailDrawer";
import SiteAdvanceFilter from "./SiteAdvanceFilter";
/* end individual import */

function SiteMaster() {
  const [translate] = useTranslation();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    SiteFilter,
    { skip: 0, take: 10 }
  );

  const [visible, setVisible] = React.useState<boolean>(false);

  const {
    value: filter,
    handleChangeInputSearch,
    handleChangeAllFilter,
  } = filterService.useFilter(modelFilter, dispatch);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList(
      siteRepository.list,
      siteRepository.count,
      filter,
      handleChangeAllFilter
    );

  const { handleTableChange, handlePagination } = tableService.useTable(
    filter,
    handleChangeAllFilter
  );

  const { selectedRowKeys } = listService.useRowSelection(
    siteRepository.delete,
    siteRepository.bulkDelete,
    null,
    null,
    null,
    handleResetList
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
    Site,
    siteRepository.get,
    siteRepository.save,
    handleLoadList
  );
  const { notifyUpdateItemSuccess, notifyUpdateItemError } =
    appMessageService.useCRUDMessage();

  const handleChangeIsDisplay = React.useCallback(
    (site) => {
      return (value: boolean) => {
        site.isDisplay = value;
        siteRepository.update(site).subscribe(
          (res) => {
            notifyUpdateItemSuccess();
            handleLoadList();
          },
          (err) => {
            notifyUpdateItemError();
          }
        );
      };
    },
    [handleLoadList, notifyUpdateItemError, notifyUpdateItemSuccess]
  );

  const menuAction = React.useCallback(
    (id: number, site: Site) => (
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
      </Menu>
    ),
    [handleOpenDetailModal, translate]
  );

  const columns: ColumnProps<Site>[] = useMemo(
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
                title={translate("sites.code")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getAntOrderType<Site, SiteFilter>(
          filter,
          nameof(list[0].code)
        ),
        render(...params: [string, Site, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
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
                title={translate("sites.name")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getAntOrderType<Site, SiteFilter>(
          filter,
          nameof(list[0].name)
        ),
        render(...params: [string, Site, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "description"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("sites.description")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].description),
        dataIndex: nameof(list[0].description),
        sorter: true,
        sortOrder: getAntOrderType<Site, SiteFilter>(
          filter,
          nameof(list[0].description)
        ),
        render(...params: [string, Site, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "icon"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("sites.icon")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].icon),
        dataIndex: nameof(list[0].icon),

        render(...params: [string, Site, number]) {
          return (
            <LayoutCell orderType="center" tableSize="sm">
              <img
                style={{
                  width: 30,
                  height: 30,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                src={params[0]}
                alt=""
              />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "logo"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("sites.logo")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].logo),
        dataIndex: nameof(list[0].logo),

        render(...params: [string, Site, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <img
                style={{
                  width: 30,
                  height: 30,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                src={params[0]}
                alt=""
              />
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "isDisplay"
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("sites.isDisplay")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },

        key: nameof(list[0].isDisplay),
        dataIndex: nameof(list[0].isDisplay),
        sorter: true,
        sortOrder: getAntOrderType<Site, SiteFilter>(
          filter,
          nameof(list[0].isDisplay)
        ),
        render(...params: [boolean, Site, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              {params[1].code !== "/landing-page" ? (
                <Switch
                  onChange={handleChangeIsDisplay(params[1])}
                  defaultChecked={params[0]}
                />
              ) : (
                <Switch defaultChecked={params[0]} disabled={true} />
              )}
            </LayoutCell>
          );
        },
      },

      {
        title: ({ sortColumns }) => {
          const sortedColumn = sortColumns?.find(
            ({ column }) => column.key === "colorCode "
          );
          return (
            <div>
              <LayoutHeader
                orderType="left"
                title={translate("sites.colorCode")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].colorCode),
        dataIndex: nameof(list[0].colorCode),
        sorter: true,
        sortOrder: getAntOrderType<Site, SiteFilter>(
          filter,
          nameof(list[0].colorCode)
        ),
        render(...params: [string, Site, number]) {
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
        width: 80,
        align: "center",
        render(id: number, site: Site) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, site)}
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
    [translate, list, filter, handleChangeIsDisplay, menuAction]
  );

  const handleCancel = React.useCallback(() => {
    setVisible(false);
  }, []);
  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("sites.master.subHeader")}
          breadcrumbItems={[
            translate("sites.master.header"),
            translate("sites.master.subHeader"),
          ]}
        />
        <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--xs p-b--xs">
            {translate("sites.master.title")}
          </div>
          <div className="page-master__content">
            <div className="page-master__tag-filter">
              <TagFilter
                value={filter}
                translate={translate}
                keyTranslate={" sites "}
                handleChangeFilter={handleChangeAllFilter}
                onClear={(value: any) => {
                  return 0;
                }}
              />
            </div>
            {(!selectedRowKeys || selectedRowKeys?.length === 0) && (
              <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
                <div className="page-master__filter d-flex align-items-center justify-content-start">
                  <InputSearch
                    valueFilter={filter}
                    classFilter={SiteFilter}
                    placeHolder={translate("general.placeholder.search")}
                    onChange={handleChangeInputSearch}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="page-master__content-table">
            <StandardTable
              rowKey={nameof(list[0].id)}
              columns={columns}
              dataSource={list}
              isDragable={true}
              tableSize={"md"}
              onChange={handleTableChange}
              loading={loadingList}
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
        <SiteAdvanceFilter
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
      <SiteDetailDrawer
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
export default SiteMaster;
