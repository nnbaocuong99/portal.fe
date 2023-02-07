import { StringFilter  } from 'react3l-advanced-filters';
import { IdFilter  } from 'react3l-advanced-filters';
import { NumberFilter  } from 'react3l-advanced-filters';
import { DateFilter  } from 'react3l-advanced-filters';
import { GuidFilter  } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class NationFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public priority?: NumberFilter = new NumberFilter();
  public statusId?: IdFilter = new IdFilter();
  public createdAt?: DateFilter = new DateFilter();
  public updatedAt?: DateFilter = new DateFilter();
  public rowId?: GuidFilter = new GuidFilter();
}
