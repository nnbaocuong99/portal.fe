import { TableRowSelection } from "antd/lib/table/interface";
import { WorkflowDirection } from "models/WorkflowDirection";
import React from "react";
import { StandardTable } from "react3l-ui-library";
import nameof from "ts-nameof.macro";

export interface WorkflowDirectionContentTableProps {
  /* start required props */
  list?: WorkflowDirection[];
  columns?: any;
  handleTableChange?: (...[, , sorter]: any[]) => void;
  rowSelection?: TableRowSelection<WorkflowDirection>;
}

export const WorkflowDirectionContentTable = React.forwardRef(
  (props: WorkflowDirectionContentTableProps) => {
    const { columns, list, handleTableChange, rowSelection } = props;

    return (
      <>
        <StandardTable
          rowKey={nameof(list[0].key)}
          columns={columns}
          pagination={false}
          dataSource={list}
          tableSize="sm"
          onChange={handleTableChange}
          rowSelection={rowSelection}
          scroll={{ y: 500, x: 1000 }}
        />
      </>
    );
  }
);

export default WorkflowDirectionContentTable;
