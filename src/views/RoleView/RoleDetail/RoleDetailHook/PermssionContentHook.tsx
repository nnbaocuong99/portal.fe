/* begin general import */
import { TrashCan16 } from "@carbon/icons-react";
import { TableRowSelection } from "antd/lib/table/interface";
import { Action, ActionFilter } from "models/Action";
import { FieldModel, FieldModelFilter } from "models/FieldModel";
import { Menu } from "models/Menu";
/* end general import */
/* begin individual import */
import { Permission } from "models/Permission";
import {
  PermissionActionMapping,
  PermissionActionMappingFilter,
} from "models/PermissionActionMapping";
import {
  PermissionContent,
  PermissionContentFilter,
} from "models/PermissionContent";
import { PermissionOperatorFilter } from "models/PermissionOperator";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FormItem,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Select,
} from "react3l-ui-library";
import { Reducer } from "redux";
import { roleRepository } from "repositories/role-repository";
import { detailService } from "services/detail-service";
import { FilterAction, filterReducer } from "services/filter-service";
import { listService } from "services/list-service";
import { utilService } from "services/util-service";
import nameof from "ts-nameof.macro";
import FieldInput from "../FieldInput/FieldInput";
/* end individual import */

export function usePermisionActionMappingHook(
  model: Permission,
  setModel?: (data: Permission) => void
) {
  const [translate] = useTranslation();
  const [listAction, setListAction] = React.useState<Action[]>([]);
  const [selectedList, setSelectedList] = React.useState<Action[]>([]);

  const {
    content: permissionActionMappings,
    setContent: setPermissionActionMappings,
  } = detailService.useContentList(
    model,
    setModel,
    nameof(model.permissionActionMappings)
  );
  React.useEffect(() => {
    if (
      model.permissionActionMappings &&
      model.permissionActionMappings.length > 0
    ) {
      let tempPermissionActionMappings = model.permissionActionMappings
        ? [...model.permissionActionMappings]
        : [];
      tempPermissionActionMappings =
        tempPermissionActionMappings?.length > 0 &&
        tempPermissionActionMappings?.filter(
          (permission) => permission?.actionId !== 0
        );

      tempPermissionActionMappings?.length > 0 &&
        tempPermissionActionMappings?.map((permission) => {
          if (permission?.id) {
            permission.actionId = permission.id;
          } else {
            permission.actionId = permission?.action?.id;
            permission.id = permission?.action?.id;
          }

          return permission;
        });
      setSelectedList(tempPermissionActionMappings);
    } else setSelectedList([]);
  }, [model.permissionActionMappings]);

  React.useEffect(() => {
    if (model.menuId) {
      roleRepository.getMenu(model.menuId).subscribe((res: Menu) => {
        const list = res.actions.map((item: any) => {
          item.key = item.id;
          return item;
        });
        setListAction(list);
      });
    }
  }, [model.menuId]);
  const selectedRowKeys = React.useMemo(() => {
    return selectedList && selectedList.length > 0
      ? selectedList.map((t: Action) => t?.id)
      : [];
  }, [selectedList]);
  const rowSelection: TableRowSelection<PermissionActionMapping> =
    React.useMemo(
      () => ({
        preserveSelectedRowKeys: true,
        onSelect: (record: PermissionActionMapping, selected: boolean) => {
          if (selected) {
            selectedList.push(record);
            setSelectedList([...selectedList]);
            setPermissionActionMappings(selectedList);
          } else {
            setSelectedList(
              selectedList.filter((t: any) => {
                return t.id ? t.id !== record.id : t.key !== record.key;
              })
            );
            setPermissionActionMappings(selectedList);
          }
        }, // single selection
        onChange: (...[selectedRowKeys, selectedRows]) => {
          if (selectedList?.length === 0) {
            setSelectedList([...selectedRows]);
            setPermissionActionMappings([...selectedRows]);
            return;
          } // if list empty, add all selectedRows to list

          const mapper: Record<any, number> = {}; // create mapper from filter
          selectedRowKeys.forEach((key: any) => {
            mapper[key] = 0;
          });
          const mergeList = [...selectedList, ...selectedRows].filter(
            (item) => typeof item !== "undefined"
          ); // merge old list with new selectedRows
          const filterList: any[] = [];
          mergeList.forEach((item) => {
            if (item !== undefined) {
              const itemId = item?.id ? item?.id : item?.key;
              if (mapper[itemId] === 0) {
                filterList.push(item);
                mapper[itemId] = mapper[itemId] + 1;
              }
            }
          }); // filter item which its key contained in selectedRowKeys
          setSelectedList([...filterList]);
          setPermissionActionMappings([...filterList]);
        }, // multi selection
        getCheckboxProps: () => ({
          disabled: false,
        }), // pass external control for disabling selection
        type: "checkbox", // selection type
        selectedRowKeys, // selectedRowKey
      }),
      [selectedList, selectedRowKeys, setPermissionActionMappings]
    );

  const [actionFilter] = React.useReducer<
    Reducer<ActionFilter, FilterAction<ActionFilter>>
  >(filterReducer, new PermissionActionMappingFilter());
  const { invokeChange: loadingList } = listService.useLocalList(listAction);

  const permissionActionMappingColumns = React.useMemo(
    () => [
      {
        title: (
          <LayoutHeader
            orderType="left"
            title={translate("permissions.actions")}
          />
        ),
        key: nameof(listAction[0].name),
        dataIndex: nameof(listAction[0].name),
        width: 200,
        render(...params: [string, Action, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },
    ],
    [listAction, translate]
  );

  return {
    filter: actionFilter,
    permissionActionMappingList: listAction,
    loadPermissionActionMappingList: loadingList,
    permissionActionMappingRowSelection: rowSelection,
    permissionActionMappings,
    setPermissionActionMappings,
    permissionActionMappingColumns,
  };
}

export function usePermisionContentHook(
  model: Permission,
  setModel?: (data: Permission) => void
) {
  const [translate] = useTranslation();

  const { content: permissionContents, setContent: setPermissionContents } =
    detailService.useContentList(
      model,
      setModel,
      nameof(model.permissionContents)
    );
  const { invokeChange: loadingList } =
    listService.useLocalList(permissionContents);

  const [permissionContentFilter] = React.useReducer<
    React.Reducer<
      PermissionContentFilter,
      FilterAction<PermissionContentFilter>
    >
  >(filterReducer, new PermissionContentFilter());

  const handleAddContent = React.useCallback(() => {
    const newContent = new PermissionContent();
    const tempPermissionContents = permissionContents
      ? [...permissionContents]
      : [];

    newContent["key"] = tempPermissionContents?.length
      ? Number(
          tempPermissionContents[tempPermissionContents?.length - 1]["key"]
        ) + 1
      : 0;
    tempPermissionContents?.length > 0
      ? setPermissionContents([...tempPermissionContents, newContent])
      : setPermissionContents([newContent]);
  }, [permissionContents, setPermissionContents]);
  const handleLocalDelete = React.useCallback(
    (permission) => {
      const tempPermissionContents = permissionContents
        ? [...permissionContents]
        : [];

      const listPermissionContent = tempPermissionContents.filter(
        (i: PermissionContent) => i.key !== permission.key
      );
      setPermissionContents([...listPermissionContent]);
    },
    [permissionContents, setPermissionContents]
  );
  const handleChangeField = React.useCallback(
    (index: number) => (value: any, object?: any) => {
      const newModel = [...permissionContents];
      newModel[index]["field"] = object;
      newModel[index]["fieldId"] = value;
      newModel[index]["permissionOperator"] = undefined;
      newModel[index]["permissionOperatorId"] = undefined;
      newModel[index]["value"] = undefined;
      setPermissionContents(newModel);
    },
    [permissionContents, setPermissionContents]
  );
  const handleChangePermissionOperator = React.useCallback(
    (index: number) => (value: any, object?: any) => {
      const newModel = [...permissionContents];
      newModel[index]["permissionOperator"] = object;
      newModel[index]["permissionOperatorId"] = value;
      newModel[index]["value"] = undefined;
      setPermissionContents(newModel);
    },
    [permissionContents, setPermissionContents]
  );

  const permissionContentColumns = React.useMemo(
    () => [
      {
        title: (
          <LayoutHeader
            orderType="center"
            title={translate("permissions.permissionContents.field")}
          />
        ),
        width: 120,
        key: nameof(permissionContents[0].field),
        dataIndex: nameof(permissionContents[0].field),
        ellipsis: true,
        render(...params: [FieldModel, PermissionContent, number]) {
          const filedFilter = new FieldModelFilter();
          filedFilter.menuId.equal = model.menuId;
          return (
            <LayoutCell orderType="center" tableSize="lg">
              <FormItem
                validateStatus={utilService.getValidateStatus(
                  permissionContents[params[2]],
                  nameof(permissionContents[params[2]].field)
                )}
                message={permissionContents[params[2]].errors?.field}
              >
                <Select
                  appendToBody
                  type={0}
                  classFilter={FieldModelFilter}
                  placeHolder={translate(
                    "permissions.permissionContents.field"
                  )}
                  getList={roleRepository.singleListField}
                  onChange={handleChangeField(params[2])}
                  value={params[1].field}
                  valueFilter={filedFilter}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="center"
            title={translate(
              "permissions.permissionContents.permissionOperator"
            )}
          />
        ),
        ellipsis: true,
        key: nameof(permissionContents[0].permissionOperator),
        width: 120,
        dataIndex: nameof(permissionContents[0].permissionOperator),
        render(...params: [number, PermissionContent, number]) {
          const permissionOperatorFilter = new PermissionOperatorFilter();
          permissionOperatorFilter.fieldTypeId.equal =
            params[1].field?.fieldTypeId;
          return (
            <LayoutCell orderType="center" tableSize="lg">
              {params[1].permissionOperator?.name === "UserId" &&
              params[0] === 101 ? (
                "="
              ) : (
                <>
                  {permissionContents[params[2]]?.fieldId &&
                  permissionContents[params[2]]?.field ? (
                    <FormItem
                      validateStatus={utilService.getValidateStatus(
                        permissionContents[params[2]],
                        nameof(permissionContents[params[2]].permissionOperator)
                      )}
                      message={
                        permissionContents[params[2]].errors?.permissionOperator
                      }
                    >
                      <Select
                        appendToBody
                        valueFilter={permissionOperatorFilter}
                        type={0}
                        classFilter={FieldModelFilter}
                        placeHolder={translate(
                          "permissions.permissionContents.permissionOperator"
                        )}
                        getList={roleRepository.singleListPermissionOperator}
                        onChange={handleChangePermissionOperator(params[2])}
                        value={params[1].permissionOperator}
                      />
                    </FormItem>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="center"
            title={translate("permissions.permissionContents.value")}
          />
        ),
        key: nameof(permissionContents[0].value),
        width: 120,
        ellipsis: true,
        dataIndex: nameof(permissionContents[0].value),
        render(...params: [string, PermissionContent, number]) {
          return (
            <LayoutCell orderType="center" tableSize="lg">
              {permissionContents[params[2]]?.fieldId &&
              permissionContents[params[2]]?.permissionOperatorId &&
              permissionContents[params[2]]?.field &&
              permissionContents[params[2]]?.permissionOperator ? (
                <FormItem
                  validateStatus={utilService.getValidateStatus(
                    permissionContents[params[2]],
                    nameof(permissionContents[params[2]].value)
                  )}
                  message={permissionContents[params[2]].errors?.value}
                >
                  <FieldInput
                    value={params[0]}
                    index={params[2]}
                    record={params[1]}
                    contents={permissionContents}
                    setContents={setPermissionContents}
                    disabled={
                      params[1].fieldId === undefined ||
                      typeof params[1].errors?.field === "string"
                    }
                  />
                </FormItem>
              ) : (
                <></>
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <LayoutHeader
            orderType="center"
            title={translate("general.actions.label")}
          />
        ),
        key: "action",
        dataIndex: nameof(permissionContents[0].id),
        fixed: "right",
        width: 60,
        align: "center",
        render(...params: [string, PermissionContent, number]) {
          return (
            <TrashCan16
              color="red"
              onClick={() => handleLocalDelete(params[1])}
            />
          );
        },
      },
    ],
    [
      translate,
      permissionContents,
      model.menuId,
      handleChangeField,
      handleChangePermissionOperator,
      setPermissionContents,
      handleLocalDelete,
    ]
  );

  return {
    permissionContentFilter,
    permissionContentList: permissionContents,
    loadPermissionContentList: loadingList,
    permissionContents,
    setPermissionContents,
    permissionContentColumns,
    handleAddPermissionContent: handleAddContent,
  };
}
