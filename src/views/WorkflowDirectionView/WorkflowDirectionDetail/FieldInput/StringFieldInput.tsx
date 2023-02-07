import { WorkflowDefinition } from "models/WorkflowDefinition";
import React from "react";
import { useTranslation } from "react-i18next";
import { InputText } from "react3l-ui-library";

export interface StringFieldInputProps {
  value?: string;
  contents?: WorkflowDefinition[];
  index?: number;
  setContents?: (v: WorkflowDefinition[]) => void;
  disabled?: boolean;
}

function StringFieldInput(props: StringFieldInputProps) {
  const [translate] = useTranslation();
  const { value: defaultValue, contents, index, setContents, disabled } = props;
  const handleChange = React.useCallback(
    (ev: any) => {
      if (contents) {
        contents[index] = { ...contents[index], value: ev };
        setContents([...contents]);
      }
    },
    [contents, index, setContents]
  );
  return (
    <InputText
      isMaterial={true}
      value={defaultValue}
      placeHolder={translate(
        "workflowDirectionConditions.placeholder.stringType"
      )}
      className={"tio-filter_list"}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}

export default StringFieldInput;
