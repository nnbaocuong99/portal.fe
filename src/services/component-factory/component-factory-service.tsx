import React from "react";
import { Observable } from "rxjs";
import { Moment } from "moment";
import { Tooltip } from "antd";
import { Popconfirm } from "antd";
import {
  AdvanceDateFilter,
  AdvanceDateRangeFilter,
  AdvanceIdFilterMaster,
  AdvanceNumberFilter,
  AdvanceStringFilter,
} from "react3l-ui-library";
import { Model, ModelFilter } from "react3l-common";

export class ComponentFactoryService {
  RenderStringFilter(
    value: string,
    onChange: (t: string) => void,
    placeholder: string,
    title?: string
  ) {
    return (
      <AdvanceStringFilter
        value={value}
        onChange={onChange}
        placeHolder={placeholder}
        label={title}
      />
    );
  }

  RenderIdFilter<TFilter extends ModelFilter>(
    value: string | number,
    onChange: (T: number, value?: Model) => void,
    classFilter: new () => TFilter,
    getList: (filter: any) => Observable<any>,
    placeholder?: string,
    title?: string
  ) {
    return (
      <AdvanceIdFilterMaster
        onChange={onChange}
        classFilter={classFilter}
        placeHolder={placeholder}
        getList={getList}
        value={value}
        title={title}
      />
    );
  }

  RenderDateFilter(
    value: Moment | [Moment, Moment],
    onChange: (value: Moment | [Moment, Moment], dateString?: string) => void,
    type: "single" | "range",
    placeholder?: string
  ) {
    if (type === "range") {
      return (
        <AdvanceDateRangeFilter
          onChange={onChange as (value: [Moment, Moment]) => void}
          value={value as [Moment, Moment]}
        />
      );
    }
    return (
      <AdvanceDateFilter
        onChange={onChange as (value: Moment) => void}
        value={value as Moment}
        placeholder={placeholder as string}
      />
    );
  }

  RenderNumberFilter(
    value: number | [number, number],
    placeholder: string | [string, string],
    onChange: (t: number | [number, number]) => void,
    type: "single" | "range",
    allowPositive: boolean = false,
    numberType: string = "DECIMAL",
    decimalDigit: number = 6
  ) {
    return (
      <AdvanceNumberFilter
        placeHolder={placeholder as string}
        value={value as number}
        onChange={onChange as (value: number) => void}
        allowPositive={allowPositive}
        numberType={numberType}
        decimalDigit={decimalDigit}
      />
    );
  }

  RenderAction = (columnAction: any) => {
    const { title, action, item, icon, hasConfirm } = columnAction;
    if (hasConfirm) {
      return (
        <Popconfirm
          placement="left"
          title={title}
          onConfirm={() => action(item)}
          okText={"Xóa"}
          cancelText={"Hủy"}
        >
          <Tooltip title={title}>
            <i
              className="tio-clear_circle"
              style={{ color: "red", fontSize: "20px" }}
            ></i>
          </Tooltip>
        </Popconfirm>
      );
    }
    return (
      <Tooltip title={title}>
        <button className="btn border-less gradient-btn-icon">
          <i className={icon} />
        </button>
      </Tooltip>
    );
  };

  RenderActionColumn = <T extends Model>(...columnActions: any[]) => {
    return (...params: [string | number, T, number]) => (
      <div className="d-flex justify-content-center button-action-table">
        {columnActions?.length > 0 &&
          columnActions.map((actionItem, index) => (
            <React.Fragment key={index}>
              {this.RenderAction({ ...actionItem, item: params[1] })}
            </React.Fragment>
          ))}
      </div>
    );
  };
}

export const componentFactoryService = new ComponentFactoryService();
