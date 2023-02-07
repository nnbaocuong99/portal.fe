import { IdFilter, NumberFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class AppUserPermissionFilter extends ModelFilter {
  public permissionId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public path?: StringFilter = new StringFilter();
  public count?: NumberFilter = new NumberFilter();
}
