import { WorkflowDefinition } from "models/WorkflowDefinition";
import { Moment } from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { DatePicker } from "react3l-ui-library";

export interface DateFieldInputProps {
  value: any;
  index?: number;
  contents?: WorkflowDefinition[];
  setContents?: (v: WorkflowDefinition[]) => void;
  disabled?: boolean;
}
function DateFieldInput(props: DateFieldInputProps) {
  const [translate] = useTranslation();
  const { value, index, contents, setContents, disabled } = props;
  const handleChange = React.useCallback(
    (moment: Moment) => {
      if (contents) {
        contents[index] = { ...contents[index], value: moment };
        setContents([...contents]);
      }
    },
    [contents, index, setContents]
  );

  return (
    <DatePicker
      isMaterial={true}
      value={value}
      placeholder={translate("principalContracts.placeholder.startedAt")}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}

export default DateFieldInput;
