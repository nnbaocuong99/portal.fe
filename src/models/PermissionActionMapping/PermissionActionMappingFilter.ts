import { IdFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class PermissionActionMappingFilter extends ModelFilter {
  public permissionId?: IdFilter = new IdFilter();
  public actionId?: IdFilter = new IdFilter();
}
