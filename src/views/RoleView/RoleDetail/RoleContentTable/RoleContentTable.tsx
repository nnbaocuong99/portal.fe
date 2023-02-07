import { TableRowSelection } from "antd/lib/table/interface";
import { Role, RoleFilter } from "models/Role";
import React, { ReactNode } from "react";
import { Pagination, StandardTable } from "react3l-ui-library";
import nameof from "ts-nameof.macro";

export interface RoleContentTableProps {
  /* start required props */
  model?: Role; // for export
  filter?: RoleFilter;
  list?: Role[];
  columns?: any;
  total?: number;
  loadingList?: boolean;
  handleTableChange?: (...[, , sorter]: any[]) => void;
  rowSelection?: TableRowSelection<Role>;
  handleLocalBulkDelete?: () => void;
  canBulkDelete?: boolean;
  handlePagination?: (skip: number, take: number) => void;
  handleAddContent?: () => void;
  handleClick?: () => void;
  onOpenModal?: () => void;
  summaryTable?: (pageData: any[]) => ReactNode;
  hasAddContentInline?: boolean; // able to add content from footer
  hasMapContentFromModal?: boolean; // able to map content from header
  hasDeleteContentPermission?: boolean; // permission to delete content
  isShowTitle?: boolean;
  isShowFooter?: boolean;
  /* end optional props */
}

export const RoleContentTable = React.forwardRef(
  (props: RoleContentTableProps, ref: any) => {
    const {
      filter,
      columns,
      list,
      total,
      handleTableChange,
      rowSelection,
      isShowFooter,
      handlePagination,
    } = props;

    return (
      <>
        <StandardTable
          rowKey={nameof(list[0].id)}
          columns={columns}
          pagination={false}
          dataSource={list}
          tableSize="sm"
          onChange={handleTableChange}
          rowSelection={rowSelection}
          scroll={{ y: 280, x: 500 }}
        />
        {isShowFooter && (
          <Pagination
            skip={filter.skip}
            take={filter.take}
            total={total}
            onChange={handlePagination}
            style={{ margin: "10px" }}
          />
        )}
      </>
    );
  }
);

RoleContentTable.defaultProps = {
  hasAddContentInline: false,
  hasMapContentFromModal: true,
  hasDeleteContentPermission: true,
  isShowTitle: false,
  isShowFooter: true,
};

export default RoleContentTable;
