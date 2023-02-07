/* begin general import */
import { Download16 } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { Init, InitFilter } from "models/Init";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";
import InputSearch from "react3l-ui-library/build/components/Input/InputSearch";

import { filterService } from "services/filter-service";
import { queryStringService } from "services/query-string-service";
import { getAntOrderType } from "services/table-service";
import nameof from "ts-nameof.macro";
import { useInitMasterHook } from "./InitMasterHook";

/* end individual import */

function InitMaster() {
  const [translate] = useTranslation();

  const [modelFilter, dispatch] = queryStringService.useQueryString(
    InitFilter,
    { skip: 0, take: 10 }
  );

  const { value: filter, handleChangeAllFilter } = filterService.useFilter(
    modelFilter,
    dispatch
  );

  const {
    list,
    loadingList,
    handlePagination,
    handleTableChange,
    rowSelection,
    handleInit,
    handleChangeInputSearch,
    selectedRowKeys,
  } = useInitMasterHook(filter, handleChangeAllFilter);

  const columns: ColumnProps<Init>[] = useMemo(
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
                title={translate("inits.code")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        sortOrder: getAntOrderType<Init, InitFilter>(
          filter,
          nameof(list[0].code)
        ),
        render(...params: [string, Init, number]) {
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
                title={translate("inits.name")}
                sortedColumn={sortedColumn}
                isSorter
              />
            </div>
          );
        },
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        sortOrder: getAntOrderType<Init, InitFilter>(
          filter,
          nameof(list[0].name)
        ),
        render(...params: [string, Init, number]) {
          return (
            <LayoutCell orderType="left" tableSize="sm">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, list, filter]
  );

  return (
    <>
      <div className="page-content">
        <PageHeader
          title={translate("inits.master.subHeader")}
          breadcrumbItems={[
            translate("inits.master.header"),
            translate("inits.master.subHeader"),
          ]}
        />
        <div className="page page-master m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--xs p-b--xs">
            {translate("inits.master.title")}
          </div>
          <div className="page-master__content">
            <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
              <div className="page-master__filter-action-search d-flex align-items-center">
                <InputSearch
                  valueFilter={filter}
                  classFilter={InitFilter}
                  placeHolder={translate("general.placeholder.search")}
                  onChange={handleChangeInputSearch}
                />
              </div>

              <div className="page-master__actions  d-flex align-items-center justify-content-start">
                <div className="page-master__filter-action d-flex align-items-center">
                  <Button
                    type="primary"
                    className="btn--lg"
                    icon={<Download16 />}
                    onClick={handleInit}
                    disabled={selectedRowKeys?.length === 0}
                  >
                    {translate("inits.button.init")}
                  </Button>
                </div>
              </div>
            </div>
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
              rowSelection={rowSelection}
            />

            <Pagination
              skip={filter?.skip}
              take={filter?.take}
              total={list?.length}
              onChange={handlePagination}
              canChangePageSize={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default InitMaster;
