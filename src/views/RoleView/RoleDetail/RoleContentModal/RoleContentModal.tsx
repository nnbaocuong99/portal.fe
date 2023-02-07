import React, { Dispatch, SetStateAction, useMemo } from "react";
import Modal, { ModalProps } from "antd/lib/modal";
import { Row, Col } from "antd";
import nameof from "ts-nameof.macro";
import "./RoleContentModal.scss";
import { useRoleContentModal } from "./RoleContentModalHook";
import { Observable } from "rxjs";
import { useTranslation } from "react-i18next";
import { Model, ModelFilter } from "react3l-common";
import { tableService } from "services/table-service";
import { Button, Pagination, StandardTable } from "react3l-ui-library";
import { Close16, Send16 } from "@carbon/icons-react";

export interface RoleContentModalProp<
  TContent extends Model, // Eg: priceListStoreMappings[]
  TMapper extends Model, // Eg: Store[]
  TFilter extends ModelFilter // Eg: StoreFilter
> extends ModalProps {
  content: TContent[];
  setContent: (content: TContent[]) => void;
  filter: TFilter;
  onUpdateNewFilter: (filter: TFilter) => void;
  onResetFilter: () => void;
  onSearch: () => void;
  getList: (filter: TFilter) => Observable<TMapper[]>;
  getTotal: (filter: TFilter) => Observable<number>;
  loadList: boolean;
  setLoadList: Dispatch<SetStateAction<boolean>>;
  selectedList: TMapper[];
  columns: any[];
  filterList: JSX.Element[];
  mapperField: string;
  mapper: (item: TContent | TMapper) => TContent;
  onSave: (mapperList: TMapper[]) => void;
  onClose: () => void;
}
export default function RoleContentModal<
  TContent extends Model,
  TMapper extends Model,
  TFilter extends ModelFilter
>(props: RoleContentModalProp<TContent, TMapper, TFilter>) {
  const [translate] = useTranslation();
  const {
    filter,
    loadList,
    setLoadList,
    onUpdateNewFilter,
    onResetFilter,
    onSearch,
    getList,
    getTotal,
    selectedList,
    columns,
    filterList,
    onSave,
    onClose,
    content,
    setContent,
    mapperField,
    mapper,
  } = props;

  const {
    list,
    count,
    loadingList,
    handlePagination,
    handleTableChange,
    rowSelection,
    selectedList: mapperList,
    setSelectedList: setMapperList,
  } = tableService.useModalTable<TMapper, TFilter>(
    filter,
    onUpdateNewFilter,
    loadList,
    setLoadList,
    onSearch,
    getList,
    getTotal,
    selectedList
  );

  const { handleCloseModal, handleSaveModal } = useRoleContentModal(
    content,
    setContent,
    onResetFilter,
    setMapperList,
    mapperList,
    mapper,
    mapperField,
    onClose,
    onSave
  );

  const renderModalFooter = useMemo(
    () => (
      <div className="d-flex justify-content-end">
        <Button
          type="secondary"
          className="btn--lg"
          icon={<Close16 />}
          onClick={handleCloseModal}
        >
          {translate("general.actions.close")}
        </Button>
        <Button
          type="primary"
          className="btn--lg"
          icon={<Send16 />}
          onClick={handleSaveModal(mapperList)}
        >
          {translate("general.actions.save")}
        </Button>
      </div>
    ),
    [handleCloseModal, handleSaveModal, mapperList, translate]
  ); // need to migrate to component factory service

  const renderModalFilters = useMemo(() => {
    if (filterList?.length > 0) {
      return filterList.map((component: JSX.Element, index: number) => (
        <Col lg={8} className="m-b--xxs p-r--sm m-t--xxs" key={index}>
          {component}
        </Col>
      ));
    }
    return null;
  }, [filterList]); // need to migrate to component factory service

  return (
    <>
      <Modal
        {...props}
        style={{ top: 20 }}
        closable={false}
        destroyOnClose={true}
        wrapClassName={"assign-app-user-modal"}
        footer={renderModalFooter}
      >
        <Row>{renderModalFilters}</Row>
        <div className="m-t--xxs">
          <StandardTable
            rowKey={nameof(list[0].id)}
            columns={columns}
            dataSource={list}
            isDragable={true}
            tableSize={"md"}
            onChange={handleTableChange}
            loading={loadingList}
            rowSelection={rowSelection}
            scroll={{ x: 1000 }}
          />
        </div>

        <Pagination
          skip={filter?.skip}
          take={filter?.take}
          total={count}
          onChange={handlePagination}
        />
        {/* end table zone */}
      </Modal>
    </>
  );
}
