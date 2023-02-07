import { IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class PermissionFieldMappingFilter extends ModelFilter {
  public permissionId?: IdFilter = new IdFilter();
  public fieldId?: IdFilter = new IdFilter();
  public value?: StringFilter = new StringFilter();
}
