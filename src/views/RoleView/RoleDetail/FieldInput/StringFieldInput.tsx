import { PermissionContent } from "models/PermissionContent";
import { Moment } from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { InputText } from "react3l-ui-library";

export interface StringFieldInputProps {
  value?: string | number | Moment | boolean | undefined;
  contents?: PermissionContent[];
  index?: number;
  setContents?: (v: PermissionContent[]) => void;
  disabled?: boolean;
}

function StringFieldInput(props: StringFieldInputProps) {
  const [translate] = useTranslation();
  const {
    value: defaultValue = "",
    contents,
    index,
    setContents,
    disabled,
  } = props;

  const handleChange = React.useCallback(
    (value) => {
      if (contents) {
        contents[index] = { ...contents[index], value };
        setContents([...contents]);
      }
    },
    [contents, index, setContents]
  );
  return (
    <InputText
      value={String(defaultValue)}
      placeHolder={translate("permissions.placeholder.stringFiled")}
      className={"tio-filter_list"}
      onChange={handleChange}
      disabled={disabled}
      type={0}
    />
  );
}

export default StringFieldInput;
