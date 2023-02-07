import { DateFilter, IdFilter, NumberFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class MasterEntityFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public createdAt?: DateFilter = new DateFilter();
  public updatedAt?: DateFilter = new DateFilter();
  public statusId?: IdFilter = new IdFilter();
  public isTree?: NumberFilter = new NumberFilter();
}
