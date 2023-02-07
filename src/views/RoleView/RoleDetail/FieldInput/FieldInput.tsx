import { PermissionContent } from "models/PermissionContent";
import { Moment } from "moment";
import React from "react";
import DateFieldInput from "./DateFieldInput";
import IdFieldInput from "./IdFieldInput";
import NumberFieldInput from "./NumberFieldInput";
import StringFieldInput from "./StringFieldInput";

export interface FieldInputProps {
  value?: string | number | Moment | boolean | undefined;
  index?: number;
  record?: PermissionContent;
  contents?: PermissionContent[];
  setContents?: (v: PermissionContent[]) => void;
  disabled?: boolean;
}

function FieldInput(props: FieldInputProps) {
  const { value, index, contents, record, setContents, disabled } = props;
  const renderInput = React.useMemo(() => {
    return () => {
      switch (record?.field?.fieldTypeId) {
        /* singleList */
        case 1:
          return (
            <IdFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        /* string */
        case 2:
          return (
            <StringFieldInput
              value={value}
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
        /* double or int */
        case 6 || 7:
          return (
            <NumberFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
        /* boolean */
        case 8:
          return (
            <NumberFieldInput
              value={value}
              index={index}
              contents={contents}
              setContents={setContents}
              disabled={disabled}
            />
          );
      }
    };
  }, [contents, disabled, index, record, setContents, value]);

  return <>{renderInput()}</>;
}

export default FieldInput;
