import { IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class PageFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public path?: StringFilter = new StringFilter();
}
