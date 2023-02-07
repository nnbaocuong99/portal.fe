import React from "react";

import { WorkflowDefinition } from "models/WorkflowDefinition";
import { Switch } from "antd";

export interface BooleanInputProps {
  value?: boolean;
  index?: number;
  contents?: WorkflowDefinition[];
  setContents?: (v: WorkflowDefinition[]) => void;
}

function BooleanInput(props: BooleanInputProps) {
  const { value, index, contents, setContents } = props;

  const [statusList] = React.useState<any[]>([
    { id: 0, value: false },
    { id: 1, value: true },
  ]);

  const handleChange = React.useCallback(
    (value: number) => {
      if (contents) {
        contents[index] = { ...contents[index], value };
        setContents([...contents]);
      }
    },
    [contents, index, setContents]
  );
  const handleChangeStatus = React.useCallback(
    (value) => {
      const statusId = value ? 1 : 0;
      // const status = statusList.filter(item => item.id === statusId)[0];
      return handleChange(statusId);
    },
    [handleChange]
  );

  return (
    <Switch
      checked={value === statusList[1]?.id ? true : false}
      onChange={handleChangeStatus}
    />
  );
}
export default BooleanInput;
