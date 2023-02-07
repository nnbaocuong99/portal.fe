import React from "react";
import { Moment } from "moment";
import { WorkflowDefinition } from "models/WorkflowDefinition";
import IdFieldInput from "./FieldInput/IdFieldInput";
import StringFieldInput from "./FieldInput/StringFieldInput";
import NumberFieldInput from "./FieldInput/NumberFieldInput";
import DateFieldInput from "./FieldInput/DateFieldInput";

export interface FieldInputProps {
  value?: string | number | Moment | boolean | undefined;
  index?: number;
  record?: WorkflowDefinition;
  contents?: WorkflowDefinition[];
  setContents?: (v: WorkflowDefinition[]) => void;
  disabled?: boolean;
  type: number;
}

function FieldInput(props: FieldInputProps) {
  const { value, index, contents, setContents, disabled, type } = props;

  const renderInput = React.useMemo(() => {
    return () => {
      switch (type) {
        /* singleList */
        case 1:
          return (
            <IdFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              // content={record}
              disabled={disabled}
            />
          );
        /* string */
        case 2:
          return (
            <StringFieldInput
              value={value as string}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        /* Long or decimal */
        case 3:
          return (
            <NumberFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        case 4:
          return (
            <NumberFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        /* date */
        case 5:
          return (
            <DateFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
      }
    };
  }, [type, value, index, contents, setContents, disabled]);

  return <>{renderInput()}</>;
}

export default FieldInput;
