import { DateFilter, IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class WorkflowDefinitionFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public creatorId?: IdFilter = new IdFilter();
  public modifierId?: IdFilter = new IdFilter();
  public workflowTypeId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public siteId?: IdFilter = new IdFilter();
  public startDate?: DateFilter = new DateFilter();
  public endDate?: DateFilter = new DateFilter();
  public statusId?: IdFilter = new IdFilter();
  public createdAt?: DateFilter = new DateFilter();
  public updatedAt?: DateFilter = new DateFilter();
}
