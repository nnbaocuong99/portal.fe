import { Role } from 'models/Role';
import { Status } from 'models/Status';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { WorkflowStep } from './WorkflowStep';


ObjectField(Role)(WorkflowStep.prototype, nameof(WorkflowStep.prototype.role));
ObjectField(Status)(WorkflowStep.prototype, nameof(WorkflowStep.prototype.status));
ObjectField(WorkflowDefinition)(WorkflowStep.prototype, nameof(WorkflowStep.prototype.workflowDefinition));

export * from './WorkflowStep';
export * from './WorkflowStepFilter';

