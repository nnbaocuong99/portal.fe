import { WorkflowParameterType } from 'models/WorkflowParameterType';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { WorkflowOperator } from './WorkflowOperator';


ObjectField(WorkflowParameterType)(WorkflowOperator.prototype, nameof(WorkflowOperator.prototype.workflowParameterType));

export * from './WorkflowOperator';
export * from './WorkflowOperatorFilter';

