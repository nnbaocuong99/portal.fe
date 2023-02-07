import { IdFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class AppUserSiteMappingFilter extends ModelFilter {
  public appUserId?: IdFilter = new IdFilter();
  public siteId?: IdFilter = new IdFilter();
}
