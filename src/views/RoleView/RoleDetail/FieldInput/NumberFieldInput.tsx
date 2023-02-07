import { PermissionContent } from "models/PermissionContent";
import { Moment } from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { InputNumber } from "react3l-ui-library";
import { DECIMAL } from "react3l-ui-library/build/components/Input/InputNumber";

export interface NumberInputProps {
  value?: string | number | Moment | boolean | undefined;
  contents?: PermissionContent[];
  index?: number;
  setContents?: (v: PermissionContent[]) => void;
  disabled?: boolean;
}

function NumberFieldInput(props: NumberInputProps) {
  const { value: defaultValue, contents, index, setContents, disabled } = props;
  const [translate] = useTranslation();

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
    <InputNumber
      value={defaultValue ? +defaultValue : 0}
      onChange={handleChange}
      disabled={disabled}
      numberType={DECIMAL}
      isMaterial={true}
      placeHolder={translate("permissions.placeholder.stringFiled")}
      type={0}
    />
  );
}

export default NumberFieldInput;
