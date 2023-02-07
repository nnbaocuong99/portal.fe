import { MasterDataFilter } from "models/MasterData";
import { PermissionContent } from "models/PermissionContent";
import { Moment } from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { Model } from "react3l-common";
import { Select, TreeSelect } from "react3l-ui-library";
import { roleRepository } from "repositories/role-repository";

export interface IdFilterInputProps {
  value?: string | number | Moment | boolean | undefined | Model;
  index?: number;
  contents?: PermissionContent[];
  setContents?: (v: PermissionContent[]) => void;
  disabled?: boolean;
}

function IdFieldInput(props: IdFilterInputProps) {
  const [translate] = useTranslation();
  const { index, contents, setContents, disabled } = props;
  const [object, setObject] = React.useState<Model>(new Model());

  React.useEffect(() => {
    if (contents[index]?.id && contents[index].masterData) {
      setObject(contents[index].masterData);
    }
  }, [contents, index]);
  const handleChange = React.useCallback(
    (value, valueObject) => {
      if (value?.length > 0) {
        setObject(value[0]);
        contents[index] = { ...contents[index], value: value[0]?.entityId };
      } else {
        setObject(valueObject);
        contents[index] = { ...contents[index], value: valueObject?.entityId };
      }
      setContents([...contents]);
    },
    [contents, index, setContents]
  );
  const renderInput = React.useMemo(() => {
    return () => {
      if (contents[index]?.field?.isMasterEntityTree === 1) {
        return (
          <TreeSelect
            isRequired
            placeHolder={translate("permissions.placeholder.idField")}
            selectable={true}
            classFilter={MasterDataFilter}
            onChange={handleChange}
            checkStrictly={true}
            getTreeData={roleRepository.singleListMasterData}
            item={object}
            disabled={disabled}
            appendToBody
            valueFilter={{
              ...new MasterDataFilter(),
              masterEntityId: { equal: contents[index]?.field?.masterEntityId },
            }}
            type={0}
          />
        );
      } else
        return (
          <Select
            classFilter={MasterDataFilter}
            placeHolder={translate("permissions.placeholder.idField")}
            getList={roleRepository.singleListMasterData}
            onChange={handleChange}
            value={object}
            valueFilter={{
              ...new MasterDataFilter(),
              masterEntityId: { equal: contents[index]?.field?.masterEntityId },
            }}
            disabled={disabled}
            appendToBody
            type={0}
          />
        );
    };
  }, [contents, disabled, handleChange, index, object, translate]);

  return <>{renderInput()}</>;
}

export default IdFieldInput;
