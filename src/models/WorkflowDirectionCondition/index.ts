import { WorkflowDirection } from 'models/WorkflowDirection';
import { WorkflowOperator } from 'models/WorkflowOperator';
import { WorkflowParameter } from 'models/WorkflowParameter';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { WorkflowDirectionCondition } from './WorkflowDirectionCondition';


ObjectField(WorkflowDirection)(WorkflowDirectionCondition.prototype, nameof(WorkflowDirectionCondition.prototype.workflowDirection));
ObjectField(WorkflowOperator)(WorkflowDirectionCondition.prototype, nameof(WorkflowDirectionCondition.prototype.workflowOperator));
ObjectField(WorkflowParameter)(WorkflowDirectionCondition.prototype, nameof(WorkflowDirectionCondition.prototype.workflowParameter));

export * from './WorkflowDirectionCondition';
export * from './WorkflowDirectionConditionFilter';

