import {
  DateFilter,
  GuidFilter,
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react3l-advanced-filters";
import { ModelFilter } from "react3l-common";

export class OrganizationFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public parentId?: IdFilter = new IdFilter();
  public activeNodeId?: IdFilter = new IdFilter();
  public path?: StringFilter = new StringFilter();
  public level?: NumberFilter = new NumberFilter();
  public statusId?: IdFilter = new IdFilter();
  public phone?: StringFilter = new StringFilter();
  public email?: StringFilter = new StringFilter();
  public avatar?: StringFilter = new StringFilter();
  public address?: StringFilter = new StringFilter();
  public taxCode?: StringFilter = new StringFilter();
  public createdAt?: DateFilter = new DateFilter();
  public updatedAt?: DateFilter = new DateFilter();
  public rowId?: GuidFilter = new GuidFilter();
}
