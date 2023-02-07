import { GuidFilter, IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class SiteFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public description?: StringFilter = new StringFilter();
  public icon?: StringFilter = new StringFilter();
  public logo?: StringFilter = new StringFilter();
  public colorCode?: StringFilter = new StringFilter();
  public themeId?: IdFilter = new IdFilter();
  public rowId?: GuidFilter = new GuidFilter();
}
