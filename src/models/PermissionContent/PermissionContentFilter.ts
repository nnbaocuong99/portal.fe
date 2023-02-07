import { IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class PermissionContentFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public permissionId?: IdFilter = new IdFilter();
  public fieldId?: IdFilter = new IdFilter();
  public permissionOperatorId?: IdFilter = new IdFilter();
  public value?: StringFilter = new StringFilter();
}
