import { StringFilter  } from 'react3l-advanced-filters';
import { IdFilter  } from 'react3l-advanced-filters';
import { DateFilter  } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class RoleFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public displayName?: StringFilter = new StringFilter();
  public username?: StringFilter = new StringFilter();
  public phone?: StringFilter = new StringFilter();
  public email?: StringFilter = new StringFilter();
  public statusId?: IdFilter = new IdFilter();
  public siteId?: IdFilter = new IdFilter();
  public startAt?: DateFilter = new DateFilter();
  public endAt?: DateFilter = new DateFilter();
}
