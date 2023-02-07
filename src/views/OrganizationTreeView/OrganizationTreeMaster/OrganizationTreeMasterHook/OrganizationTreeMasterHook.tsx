import { Modal } from "antd";
import { AxiosError } from "axios";
import { TFunction } from "i18next";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Organization, OrganizationFilter } from "models/Organization";
import React, { ChangeEvent, useCallback, useState } from "react";
import { IdFilter, StringFilter } from "react3l-advanced-filters";
import { organizationRepository } from "repositories/organization-repository";
import { finalize } from "rxjs";
import appMessageService from "services/app-message-service";
import { detailService } from "services/detail-service";
import { tableService } from "services/table-service";
import { webService } from "services/web-service";

export function useOrganizationTreeMasterHook(
  translate: TFunction,
  setListTree: (value: React.SetStateAction<any[]>) => void,
  loadingTable?: boolean,
  loadingTree?: boolean,
  setLoadingTable?: (value: React.SetStateAction<boolean>) => void,
  setLoadingTree?: (value: React.SetStateAction<boolean>) => void,
  listTree?: Organization[],
  internalExpandedKeys?: number[],
  setInternalExpandedKeys?: React.Dispatch<React.SetStateAction<number[]>>
) {
  const [currentNode, setCurrentNode] = useState<Organization>(
    new Organization()
  );
  const [isActive, setActive] = useState<boolean>(false);
  const {
    notifyUpdateItemSuccess,
    notifyUpdateItemError,
    // notifyDeleteItemSuccess,
  } = appMessageService.useCRUDMessage();
  const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
  const [loadingModel, setLoadingModel] = useState<boolean>(false);
  const [subscription] = webService.useSubscription();
  const [filterTree, setFilterTree] = React.useState<OrganizationFilter>(
    new OrganizationFilter()
  );
  const [listInTable, setListInTable] = React.useState<Organization[]>([]);
  const [filterAppUserTable, setFilterAppUserTable] =
    React.useState<AppUserFilter>({
      ...new AppUserFilter(),
      skip: 0,
      take: 10,
      filterType: { equal: 1 },
    });

  const {
    model,
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeTreeField,
  } = detailService.useDetailModal(
    Organization,
    organizationRepository.get,
    organizationRepository.save
  );

  // Open drawer to edit org info
  const handleOpenDetailModal = useCallback(
    (id: number) => {
      if (!loadingTable && !loadingTree) {
        setIsOpenDetailModal(true);
        if (id) {
          setLoadingModel(true);
          subscription.add(
            organizationRepository
              .get(id)
              .pipe(finalize(() => setLoadingModel(false)))
              .subscribe((item: Organization) => {
                handleChangeAllField(item);
              })
          );
        }
      }
    },
    [handleChangeAllField, loadingTable, loadingTree, subscription]
  );

  const handleGoCreate = React.useCallback(
    (node: Organization) => () => {
      if (!loadingTable && !loadingTree) {
        const newModel = new Organization();
        newModel.parent = node;
        newModel.parentId = node?.id;
        handleChangeAllField(newModel);
        handleOpenDetailModal(null);
      }
    },
    [handleChangeAllField, handleOpenDetailModal, loadingTable, loadingTree]
  );

  // Kiểm tra 1 node có xuất hiện nút arrow ở trước hay không
  const handleCheckDisplayOfArrowButton = React.useCallback(
    (nodeId: number, listTree: Organization[]) => {
      let tempListTree = [];
      for (var i = 0; i < listTree.length; i++) {
        let ids = tempListTree.length > 0 ? tempListTree.map((o) => o?.id) : [];
        if (!ids.includes(listTree[i]?.id)) {
          tempListTree.push(listTree[i]);
        }
      }
      // Kiểm tra xem trong listTree hiện tại, node đang xét có children hay không
      let countChildOfNode = 0;
      tempListTree &&
        tempListTree?.length > 0 &&
        tempListTree.map((o) => {
          if (o?.parentId === nodeId) countChildOfNode++;
          return countChildOfNode;
        });
      // Tìm kiếm node đang xét trong listTree và index của nó để chuẩn bị modify
      let nodeFinded = tempListTree.find((node) => node?.id === nodeId);
      let indexOfNodeFinded = tempListTree.indexOf(nodeFinded);
      tempListTree.splice(indexOfNodeFinded, 1);
      if (nodeFinded) {
        if (countChildOfNode > 0) {
          nodeFinded.hasChildren = true;
        } else {
          nodeFinded.hasChildren = false;
        }
        // Thêm node đã chỉnh sửa vào listTree
        tempListTree.splice(indexOfNodeFinded, 0, nodeFinded);
      }
      return tempListTree;
    },
    []
  );
  // Delete org on tree
  const handleDelete = useCallback(
    (item: Organization) => {
      if (!loadingTable && !loadingTree) {
        setLoadingTree(true);
        subscription.add(
          organizationRepository
            .delete(item)
            .pipe(
              finalize(() => {
                setLoadingTree(false);
              })
            )
            .subscribe(
              (item: Organization) => {
                let listTmp = listTree.filter((i) => i.id !== item.id);
                if (item?.parentId) {
                  listTmp = handleCheckDisplayOfArrowButton(
                    item?.parentId,
                    listTmp
                  );
                }

                setListTree(listTmp);
                let tempListKey =
                  internalExpandedKeys.length > 0
                    ? [...internalExpandedKeys]
                    : [];
                tempListKey = tempListKey.filter((o) => o !== item?.id);
                setInternalExpandedKeys(tempListKey);
                if (item?.id === currentNode?.id) setCurrentNode(listTmp[0]);
                notifyUpdateItemSuccess({
                  message: translate("general.message.deleteSuccess"),
                });
              },
              (err) => {
                notifyUpdateItemError({
                  message: translate("general.message.deleteError"),
                });
              }
            )
        );
      }
    },
    [
      currentNode?.id,
      handleCheckDisplayOfArrowButton,
      internalExpandedKeys,
      listTree,
      loadingTable,
      loadingTree,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      setInternalExpandedKeys,
      setListTree,
      setLoadingTree,
      subscription,
      translate,
    ]
  );

  const onClickDeleteIcon = useCallback(
    (item: Organization) => {
      Modal.confirm({
        title: translate("general.delete.content"),

        okType: "danger",
        onOk() {
          handleDelete(item);
        },
      });
    },
    [handleDelete, translate]
  );

  // Xóa những node trùng trên tree sau các thao tác
  const handleRemoveDuplicateNode = React.useCallback(
    (concatListTree: Organization[]) => {
      var newListTree: Organization[] = [];
      for (var i = 0; i < concatListTree.length; i++) {
        let ids = newListTree.length > 0 ? newListTree.map((o) => o?.id) : [];
        if (!ids.includes(concatListTree[i]?.id)) {
          newListTree.push(concatListTree[i]);
        }
      }
      return newListTree;
    },
    []
  );

  // tìm ra id các node có level = level node hiện tại +1, parentId = node.id
  const handleFindChildrenOfNode = React.useCallback(
    (id: number, level: number, item?: Organization) => {
      setLoadingTree(true);
      const tempFilter = { ...filterTree };
      tempFilter["level"]["equal"] = level;

      if (!tempFilter["IsFilterTree"]) {
        tempFilter["parentId"]["equal"] = id;
        tempFilter["activeNodeId"] = new IdFilter();
      } else {
        tempFilter["parentId"] = new IdFilter();
      }

      organizationRepository
        .list(tempFilter)
        .pipe(finalize(() => setLoadingTree(false)))
        .subscribe((res) => {
          // Thêm id node cha hiện tại vào expandedKey của tree
          let tempListKey =
            internalExpandedKeys.length > 0 ? [...internalExpandedKeys] : [];
          tempListKey.push(id);
          tempListKey = Array.from(new Set(tempListKey));
          tempListKey = tempListKey.filter(
            (o) => o !== null && o !== undefined
          );

          setInternalExpandedKeys(tempListKey);
          // Thêm các node con tìm được vào list để hiển thị trên tree
          let tempListTree = [...listTree];

          if (item) {
            let nodeFinded = listTree.find((node) => node?.id === item?.id);
            if (nodeFinded) {
              tempListTree.splice(tempListTree.indexOf(nodeFinded), 1);
            }
          }
          let concatListTree = [...tempListTree, ...res];
          concatListTree = handleRemoveDuplicateNode(concatListTree);
          if (id) {
            concatListTree = handleCheckDisplayOfArrowButton(
              id,
              concatListTree
            );
          }

          setListTree(concatListTree);
        });
    },
    [
      filterTree,
      handleCheckDisplayOfArrowButton,
      handleRemoveDuplicateNode,
      internalExpandedKeys,
      listTree,
      setInternalExpandedKeys,
      setListTree,
      setLoadingTree,
    ]
  );
  const handleGetDetail = React.useCallback(
    (filter: AppUserFilter) => {
      setLoadingTable(true);
      organizationRepository
        .get(filter["id"]["equal"], filter["filterType"]["equal"])
        .pipe(
          finalize(() => {
            setLoadingTable(false);
          })
        )
        .subscribe((res) => {
          if (res) {
            setCurrentNode(res);
            setListInTable(res?.appUsers);
          }
        });
    },
    [setLoadingTable]
  );

  // Save in drawer
  const handleSaveModel = useCallback(() => {
    setLoadingModel(true);
    subscription.add(
      organizationRepository
        .save(model)
        .pipe(finalize(() => setLoadingModel(false)))
        .subscribe(
          (item: Organization) => {
            handleFindChildrenOfNode(item?.parentId, item?.level, item);
            if (filterAppUserTable["id"]["equal"]) {
              handleGetDetail(filterAppUserTable);
            }

            handleChangeAllField(item); // setModel
            setIsOpenDetailModal(false); // close Modal
            notifyUpdateItemSuccess(); // global message service go here
          },
          (error: AxiosError<Organization>) => {
            if (error.response && error.response.status === 400)
              handleChangeAllField(error.response?.data);
            notifyUpdateItemError();
          }
        )
    );
  }, [
    subscription,
    model,
    filterAppUserTable,
    handleFindChildrenOfNode,
    handleGetDetail,
    handleChangeAllField,
    notifyUpdateItemSuccess,
    notifyUpdateItemError,
  ]);

  const handleEnumFilter = useCallback(
    (value) => {
      setFilterAppUserTable({
        ...filterAppUserTable,
        skip: 0,
        take: 10,
        filterType: { equal: value },
      });
      if (currentNode?.id) {
        handleGetDetail({
          ...filterAppUserTable,
          skip: 0,
          take: 10,
          filterType: { equal: value },
        });
      }
    },
    [currentNode?.id, filterAppUserTable, handleGetDetail]
  );
  // Hàm lấy ra các kết quả tìm kiếm
  const handleFilterTree = React.useCallback(
    (filter?: OrganizationFilter, resetFilter?: boolean) => {
      setLoadingTree(true);
      organizationRepository
        .list(filter)
        .pipe(finalize(() => setLoadingTree(false)))
        .subscribe((res: any) => {
          if (currentNode?.id) {
            if (filter["IsFilterTree"] && !resetFilter) {
              let tempListTree: Organization[] = [];
              let tempInternalExpandedKeys: number[] = [];
              let listIdParentOfRes = currentNode?.path.split(".");
              listIdParentOfRes.pop();
              listIdParentOfRes &&
                listIdParentOfRes?.length > 0 &&
                // eslint-disable-next-line array-callback-return
                listIdParentOfRes.map((o) => {
                  let nodeFinded = listTree.find(
                    (node) => String(node?.id) === o
                  );
                  tempListTree.push(nodeFinded);
                  tempInternalExpandedKeys.push(Number(o));
                });
              setInternalExpandedKeys(tempInternalExpandedKeys);
              tempListTree = [...tempListTree, ...res];
              tempListTree = handleCheckDisplayOfArrowButton(
                currentNode?.id,
                tempListTree
              );
              setListTree(tempListTree);
            } else {
              setListTree(res);
            }
          } else {
            setListTree(res);
          }
        });
    },
    [
      currentNode,
      handleCheckDisplayOfArrowButton,
      listTree,
      setInternalExpandedKeys,
      setListTree,
      setLoadingTree,
    ]
  );
  // Filter tại ô tìm kiếm
  const handleChangeTreeFilter = React.useCallback(
    () => (value: any) => {
      let tempFilter = { ...filterTree };
      tempFilter["level"]["equal"] = undefined;
      let resetFilter = false; // flag đánh dấu khi nào tất cả bộ lọc bị xóa hết
      if (value) {
        tempFilter["name"]["contain"] = value;
        tempFilter["IsFilterTree"] = true;
        tempFilter["activeNodeId"]["equal"] = currentNode?.id;
      } else tempFilter["name"] = new StringFilter();
      // Nếu không tìm kiếm gì thì reset lại cây
      if (!tempFilter["name"]["contain"]) {
        setInternalExpandedKeys([]);
        setCurrentNode(undefined);
        resetFilter = true;
        tempFilter = {
          ...new OrganizationFilter(),
          parentId: { equal: undefined },
        };
      }
      setFilterTree(tempFilter);
      handleFilterTree(tempFilter, resetFilter);
    },
    [currentNode?.id, filterTree, handleFilterTree, setInternalExpandedKeys]
  );
  const { handleTableChange, handlePagination } = tableService.useTable(
    filterAppUserTable,
    setFilterAppUserTable
  );
  const pagination = tableService.usePagination(
    filterAppUserTable,
    currentNode?.appUsers?.length
  );
  // Hàm xử lý khi ấn vào mũi tên của 1 node
  const handleClickIconNode = useCallback(
    (node) => {
      setCurrentNode(node);
      if (!loadingTable && !loadingTree) {
        // display children of chosen node
        const newTreeFilter = {
          ...filterTree,
        };
        setLoadingTree(true);
        organizationRepository
          .list({
            ...new OrganizationFilter(),
            parentId: { equal: node?.id },
            level: { equal: undefined },
          })
          .pipe(finalize(() => setLoadingTree(false)))
          .subscribe((res: Organization[]) => {
            let tempListTree =
              listTree && listTree?.length > 0 ? [...listTree] : [];
            // Nếu đang filter, khi ấn vào 1 node, cần xóa hết con cũ của nó, thay node mới vào để đúng với bộ lọc hiện tại
            if (newTreeFilter["IsFilterTree"] && tempListTree.length > 0) {
              tempListTree = tempListTree.filter(
                (o) => o?.parentId !== node?.id
              );
            }

            let concatListTree = [...tempListTree, ...res];
            concatListTree = handleRemoveDuplicateNode(concatListTree);
            if (res?.length === 0) {
              concatListTree &&
                concatListTree?.length > 0 &&
                concatListTree.map((o) => {
                  if (o?.id === node?.id) {
                    o.hasChildren = false;
                  }
                  return o;
                });
            }
            setListTree(concatListTree);
          });
      }
    },
    [
      filterTree,
      handleRemoveDuplicateNode,
      listTree,
      loadingTable,
      loadingTree,
      setListTree,
      setLoadingTree,
    ]
  );
  // Hàm xử lý khi ấn vào tiêu đề của 1 node
  const handleClickTitleNode = useCallback(
    (node) => {
      setCurrentNode(node);
      if (!loadingTable && !loadingTree) {
        const tempFilter = {
          ...new AppUserFilter(),
          id: { equal: node?.id },
          filterType: { equal: 1 },
          skip: 0,
          take: 10,
        };
        // display data in table
        setFilterAppUserTable(tempFilter);
        handleGetDetail(tempFilter);
      }
      setActive(true);
    },
    [handleGetDetail, loadingTable, loadingTree]
  );
  const handleDeleteAppUser = React.useCallback(
    (appUser) => {
      const index = currentNode.appUsers
        .map((item: AppUser) => item.id)
        .indexOf(appUser.id);
      Modal.confirm({
        title: translate("general.delete.content"),
        okType: "danger",
        onOk() {
          currentNode.appUsers.splice(index);

          organizationRepository.deleteAppUser(currentNode).subscribe(
            (res) => {
              notifyUpdateItemSuccess();
              setCurrentNode(res);
            },
            (err) => {
              notifyUpdateItemError();
            }
          );
        },
      });
    },
    [currentNode, translate, notifyUpdateItemSuccess, notifyUpdateItemError]
  );
  const handleCloseDetailModal = useCallback(() => {
    setIsOpenDetailModal(false);
    handleChangeAllField({ ...new Organization() });
  }, [handleChangeAllField]);

  // handle Import Error
  const handleImportError = useCallback(
    (error: AxiosError<any>) => {
      Modal.error({
        title: translate("general.update.error"),
        content: error.response.data,
      });
    },
    [translate]
  );
  const handleImportList = React.useCallback(() => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files.length > 0) {
        const file: File = event.target.files[0];
        subscription.add(
          organizationRepository.import(file).subscribe({
            next: (res: any) => {
              let tempListTree =
                listTree && listTree?.length > 0 ? [...listTree] : [];

              let concatListTree = [...tempListTree, ...res];
              concatListTree = handleRemoveDuplicateNode(concatListTree);
              setListTree(concatListTree);
              Modal.success({
                content: translate("general.update.success"),
              });
            }, // onSuccess
            error: (err: any) => handleImportError(err),
          })
        );
      }
    };
  }, [
    subscription,
    listTree,
    handleRemoveDuplicateNode,
    setListTree,
    translate,
    handleImportError,
  ]);

  return {
    isActive,
    filterTree,
    currentNode,
    setCurrentNode,
    handleClickIconNode,
    handleClickTitleNode,
    onClickDeleteIcon,
    filterAppUserTable,
    handleDeleteAppUser,
    handleTableChange,
    handlePagination,
    handleGetDetail,
    handleEnumFilter,
    handleRemoveDuplicateNode,
    isOpenDetailModal,
    loadingModel,
    handleOpenDetailModal,
    handleGoCreate,
    handleSaveModel,
    handleCloseDetailModal,
    model,
    handleChangeSingleField,
    handleChangeTreeField,
    handleChangeAllField,
    handleChangeTreeFilter,
    pagination,
    listInTable,
    handleImportList,
  };
}
