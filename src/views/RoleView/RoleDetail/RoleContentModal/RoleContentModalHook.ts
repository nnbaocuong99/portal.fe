import { useCallback } from "react";
import { Model } from "react3l-common";
import {
  filterContentInList,
  filterContentNotInList,
  getIdsFromContent,
} from "services/table-service";

export function useRoleContentModal<
  TContent extends Model,
  TMapper extends Model
>(
  content: TContent[],
  setContent: (content: TContent[]) => void,
  handleResetFilter: () => void,
  setMapperList: (list: TMapper[]) => void,
  mapperList: TMapper[],
  mapper: (model: TContent | TMapper) => TContent, // mapping method from content to content or mapper to content
  mapperField: string,
  onClose?: () => void,
  onSave?: (mapperList: TMapper[]) => void
) {
  const handleCloseModal = useCallback(() => {
    handleResetFilter(); // resetFilter to default
    if (content && mapperField) {
      setMapperList([...content.map((item) => item[mapperField])]); // reset mapperList by content
    }
    if (typeof onClose === "function") {
      return onClose();
    }
  }, [handleResetFilter, onClose, content, mapperField, setMapperList]); // handleCloseModal

  const handleSaveModal = useCallback(
    (list: TMapper[]) => {
      let tempContent = content ? [...content] : [];
      return () => {
        if (list?.length > 0 && tempContent.length > 0) {
          // merge old and new content
          list
            .filter(
              filterContentNotInList(
                getIdsFromContent(tempContent, `${mapperField}Id`),
                `id`
              )
            )
            .forEach((item: TMapper) => {
              tempContent.push(mapper(item));
            });
          // remove contents which id not included in list ids
          const newContent = tempContent.filter(
            filterContentInList(
              getIdsFromContent(list, `id`),
              `${mapperField}Id`
            )
          );
          setContent([...newContent]);
        }
        if (list?.length > 0 && tempContent.length === 0) {
          const newContents = list.map((item: TMapper) => mapper(item));
          setContent([...newContents]);
        }
        if (list?.length === 0) setContent([]); // if list empty, setContent to []

        if (typeof onSave === "function") {
          onSave(mapperList);
        }
      };
    },
    [setContent, content, mapper, mapperField, mapperList, onSave]
  ); // handleSave modal

  return {
    handleCloseModal,
    handleSaveModal,
  };
}
