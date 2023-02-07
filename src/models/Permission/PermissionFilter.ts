import { IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class PermissionFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public roleId?: IdFilter = new IdFilter();
  public menuId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
}
