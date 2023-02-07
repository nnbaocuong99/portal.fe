import { IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class WorkflowOperatorFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public workflowParameterTypeId?: IdFilter = new IdFilter();
}
