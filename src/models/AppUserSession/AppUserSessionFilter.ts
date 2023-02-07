import { IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class AppUserSessionFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public refreshToken?: StringFilter = new StringFilter();
  public appUserId?: IdFilter = new IdFilter();
  public deviceName?: StringFilter = new StringFilter();
  public statusId?: IdFilter = new IdFilter();
}
