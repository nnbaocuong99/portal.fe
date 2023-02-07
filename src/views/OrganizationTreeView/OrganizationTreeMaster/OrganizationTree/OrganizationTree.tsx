import {
  ChevronDown16,
  ChevronRight16,
  OverflowMenuHorizontal16,
} from "@carbon/icons-react";
import { Col, Dropdown, Menu, Row } from "antd";
import Tooltip from "antd/lib/tooltip";
import { TreeProps as AntdTreeProps } from "antd/lib/tree";
import DirectoryTree from "antd/lib/tree/DirectoryTree";
import classNames from "classnames";
import { translate } from "i18n/i18n";
import { Organization } from "models/Organization";
import React from "react";
import { TreeNode } from "react3l-ui-library/build/components/Tree/TreeNode";
import "./OrganizationTree.scss";

export interface TreeProps {
  tree?: TreeNode<Organization>[];
  listTree?: Organization[];
  defaultExpandedKeys?: number[];
  onAdd?: (node: Organization) => () => void;
  onEdit?: (id?: number) => void;
  onDelete?: (node: Organization) => void;
  onShowChildOfNode?(id: number): void;
  onShowDataTable?(id: number): void;
  setInternalExpandedKeys?: React.Dispatch<React.SetStateAction<number[]>>;
  internalExpandedKeys?: number[];
  setCurrentNode?: React.Dispatch<React.SetStateAction<Organization>>;
  currentNode?: Organization;
}

function OrganizationTree(props: TreeProps) {
  const {
    tree,
    onShowChildOfNode,
    onShowDataTable,
    setCurrentNode,
    internalExpandedKeys,
    setInternalExpandedKeys,
    onAdd,
    onDelete,
    onEdit,
    currentNode,
    listTree,
  } = props;

  const handleSliceName = React.useCallback((name: string) => {
    if (name.length > 30) {
      return name.slice(0, 30) + "...";
    } else {
      return name;
    }
  }, []);
  const handleSelect: AntdTreeProps["onSelect"] = React.useCallback(
    (
      selectedKeys: any[],
      info: {
        event: "select";
        selected: boolean;
        node: any;
        selectedNodes: any[];
        nativeEvent: any;
      }
    ) => {
      setCurrentNode(info?.selectedNodes[0]?.item);
      if (
        info?.nativeEvent?.target?.innerHTML ===
          `<path d="M11 8L6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z"></path>` ||
        info?.nativeEvent?.target?.innerHTML ===
          `<path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"></path>`
      ) {
        let tempInternalExpandedKeys =
          internalExpandedKeys?.length > 0 ? [...internalExpandedKeys] : [];
        if (info?.node?.expanded) {
          tempInternalExpandedKeys = tempInternalExpandedKeys.filter(
            (o) => o !== info?.node?.key
          );
        } else {
          onShowChildOfNode(info?.node?.item);
          tempInternalExpandedKeys.push(info?.node?.key);
        }
        // Tìm ra những node nhận node đang được click làm cha
        let listNodeChildOfCurNode = listTree.filter(
          (o) => o?.parentId === selectedKeys[0]
        );
        listNodeChildOfCurNode?.length > 0 &&
          // eslint-disable-next-line array-callback-return
          listNodeChildOfCurNode.map((o) => {
            tempInternalExpandedKeys = tempInternalExpandedKeys.filter(
              (key) => key !== o?.id
            );
          });
        setInternalExpandedKeys(tempInternalExpandedKeys);
      }
    },
    [
      internalExpandedKeys,
      listTree,
      onShowChildOfNode,
      setCurrentNode,
      setInternalExpandedKeys,
    ]
  );

  const menuAction = React.useCallback(
    (node: any) => (
      <Menu>
        {node?.item?.statusId ? (
          <Menu.Item key="1">
            <div
              className="ant-action-menu text-center"
              onClick={onAdd(node?.item)}
            >
              {translate("general.actions.create")}
            </div>
          </Menu.Item>
        ) : (
          <></>
        )}

        {typeof onEdit === "function" && (
          <Menu.Item key="2">
            <div
              className="ant-action-menu text-center"
              onClick={() => onEdit(node?.key)}
            >
              {translate("general.actions.edit")}
            </div>
          </Menu.Item>
        )}
        {typeof onDelete === "function" &&
          !node?.item?.hasChildren &&
          !node?.item?.used && (
            <Menu.Item key="3">
              <div
                className="ant-action-menu text-center"
                onClick={() => onDelete(node?.item)}
              >
                {translate("general.actions.delete")}
              </div>
            </Menu.Item>
          )}
      </Menu>
    ),
    [onAdd, onEdit, onDelete]
  );

  const handleRenderTitle = React.useCallback(
    (node) => {
      return (
        <Row
          id="item0"
          className={classNames("d-flex ", {
            "tree-active": node?.key === currentNode?.id,
          })}
        >
          <Col
            lg={1}
            className="organization_tree-icon"
            onClick={() => handleSelect}
          >
            {node.item?.hasChildren &&
              internalExpandedKeys &&
              !internalExpandedKeys.includes(node.key) && <ChevronRight16 />}
            {node.item?.hasChildren &&
              internalExpandedKeys &&
              internalExpandedKeys.includes(node.key) && <ChevronDown16 />}
          </Col>

          <Col lg={20} onClick={() => onShowDataTable(node?.item)}>
            <Tooltip placement="topLeft" title={node?.item?.ten}>
              <div className="tree-content-wrapper">
                {node?.title?.length > 30 && (
                  <Tooltip placement="topLeft" title={node?.title}>
                    <div className=" w-100">{handleSliceName(node?.title)}</div>
                  </Tooltip>
                )}
                {node?.title?.length <= 30 && (
                  <div className="w-100">{node?.title} </div>
                )}
              </div>
            </Tooltip>
          </Col>
          <Col
            lg={3}
            className="actions"
            style={{
              right: 25,
              position: "absolute",
            }}
          >
            <Dropdown
              overlay={menuAction(node)}
              trigger={["click"]}
              placement="bottom"
              arrow
            >
              <OverflowMenuHorizontal16 />
            </Dropdown>
            {/* {typeof onAdd === "function" && (
              <button
                onClick={onAdd(node?.item)}
                disabled={node?.item?.statusId === 1 ? false : true}
              >
                <Add16 />
              </button>
            )}
            {typeof onEdit === "function" && (
              <span onClick={() => onEdit(node?.key)}>
                <Edit16 />
              </span>
            )}
            {typeof onDelete === "function" &&
              !node?.item?.hasChildren &&
              !node?.item?.used && (
                <span onClick={() => onDelete(node?.item)}>
                  <TrashCan16 />
                </span>
              )} */}
          </Col>
        </Row>
      );
    },
    [
      currentNode?.id,
      handleSelect,
      handleSliceName,
      internalExpandedKeys,
      menuAction,
      onShowDataTable,
    ]
  );
  return (
    <div className="organization_tree">
      {tree.length > 0 && (
        <DirectoryTree
          {...props}
          virtual
          expandedKeys={internalExpandedKeys}
          treeData={tree} // pass internalTreeData here
          titleRender={handleRenderTitle}
          onSelect={handleSelect}
          showIcon={false}
        ></DirectoryTree>
      )}
    </div>
  );
}

export default OrganizationTree;
