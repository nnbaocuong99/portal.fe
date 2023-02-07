import { IdFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class ActionPageMappingFilter extends ModelFilter {
  public pageId?: IdFilter = new IdFilter();
  public actionId?: IdFilter = new IdFilter();
}
