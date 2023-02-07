import {
  DateFilter,
  GuidFilter,
  IdFilter,
  StringFilter,
} from "react3l-advanced-filters";
import { ModelFilter } from "react3l-common";

export class AppUserFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public siteId?: IdFilter = new IdFilter();
  public filterType?: IdFilter = new IdFilter();
  public username?: StringFilter = new StringFilter();
  public password?: StringFilter = new StringFilter();
  public otpCode?: StringFilter = new StringFilter();
  public otpExpired?: DateFilter = new DateFilter();
  public displayName?: StringFilter = new StringFilter();
  public avatar?: StringFilter = new StringFilter();
  public singnatureUrl?: StringFilter = new StringFilter();
  public birthday?: DateFilter = new DateFilter();
  public address?: StringFilter = new StringFilter();
  public email?: StringFilter = new StringFilter();
  public phone?: StringFilter = new StringFilter();
  public organizationId?: IdFilter = new IdFilter();
  public department?: StringFilter = new StringFilter();
  public sexId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
  public createdAt?: DateFilter = new DateFilter();
  public updatedAt?: DateFilter = new DateFilter();
  public rowId?: GuidFilter = new GuidFilter();
}
