import { IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class WorkflowDirectionConditionFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public workflowDirectionId?: IdFilter = new IdFilter();
  public workflowParameterId?: IdFilter = new IdFilter();
  public workflowOperatorId?: IdFilter = new IdFilter();
  public value?: StringFilter = new StringFilter();
}
