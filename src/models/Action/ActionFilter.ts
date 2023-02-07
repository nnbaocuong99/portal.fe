import { IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class ActionFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public menuId?: IdFilter = new IdFilter();
}
