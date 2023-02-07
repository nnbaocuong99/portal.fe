import { Site } from 'models/Site';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { WorkflowType } from './WorkflowType';


ObjectField(Site)(WorkflowType.prototype, nameof(WorkflowType.prototype.site));

export * from './WorkflowType';
export * from './WorkflowTypeFilter';

