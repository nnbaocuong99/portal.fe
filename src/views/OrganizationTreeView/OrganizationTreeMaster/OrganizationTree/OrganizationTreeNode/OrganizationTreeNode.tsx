import { DataNode } from "antd/lib/tree";
import { Model } from "react3l-common";

export class OrganizationTreeNode<T extends Model> implements DataNode {
  public title: string;
  public key: number;
  public item?: Model;
  public children: OrganizationTreeNode<T>[];
  public disabled: boolean;

  constructor(model?: T) {
    if (model) {
      this.key = model.id;
      this.item = { ...model };
      this.children = [];
      this.title = model.name;
      this.disabled = model.disabled;
    } else {
      this.title = "";
      this.key = null;
      this.children = [];
      this.item = {};
      this.disabled = false;
    }
  }
}
