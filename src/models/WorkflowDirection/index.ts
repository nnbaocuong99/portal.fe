import { Status } from 'models/Status';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDirectionCondition } from 'models/WorkflowDirectionCondition';
import { WorkflowStep } from 'models/WorkflowStep';
import { ObjectField, ObjectList } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { WorkflowDirection } from './WorkflowDirection';


ObjectField(WorkflowStep)(WorkflowDirection.prototype, nameof(WorkflowDirection.prototype.fromStep));
ObjectField(Status)(WorkflowDirection.prototype, nameof(WorkflowDirection.prototype.status));
ObjectField(WorkflowStep)(WorkflowDirection.prototype, nameof(WorkflowDirection.prototype.toStep));
ObjectField(WorkflowDefinition)(WorkflowDirection.prototype, nameof(WorkflowDirection.prototype.workflowDefinition));
ObjectList(WorkflowDirectionCondition)(WorkflowDirection.prototype, nameof(WorkflowDirection.prototype.workflowDirectionConditions));

export * from './WorkflowDirection';
export * from './WorkflowDirectionFilter';

