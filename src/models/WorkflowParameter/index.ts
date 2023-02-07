import { WorkflowParameterType } from 'models/WorkflowParameterType';
import { WorkflowType } from 'models/WorkflowType';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { WorkflowParameter } from './WorkflowParameter';


ObjectField(WorkflowParameterType)(WorkflowParameter.prototype, nameof(WorkflowParameter.prototype.workflowParameterType));
ObjectField(WorkflowType)(WorkflowParameter.prototype, nameof(WorkflowParameter.prototype.workflowType));

export * from './WorkflowParameter';
export * from './WorkflowParameterFilter';

