import { AppUser } from 'models/AppUser';
import { Organization } from 'models/Organization';
import { Site } from 'models/Site';
import { Status } from 'models/Status';
import { WorkflowDirection } from 'models/WorkflowDirection';
import { WorkflowStep } from 'models/WorkflowStep';
import { WorkflowType } from 'models/WorkflowType';
import { ObjectField, ObjectList } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { WorkflowDefinition } from './WorkflowDefinition';


ObjectField(AppUser)(WorkflowDefinition.prototype, nameof(WorkflowDefinition.prototype.creator));
ObjectField(AppUser)(WorkflowDefinition.prototype, nameof(WorkflowDefinition.prototype.modifier));
ObjectField(Organization)(WorkflowDefinition.prototype, nameof(WorkflowDefinition.prototype.organization));
ObjectField(Site)(WorkflowDefinition.prototype, nameof(WorkflowDefinition.prototype.site));
ObjectField(Status)(WorkflowDefinition.prototype, nameof(WorkflowDefinition.prototype.status));
ObjectField(WorkflowType)(WorkflowDefinition.prototype, nameof(WorkflowDefinition.prototype.workflowType));
ObjectList(WorkflowDirection)(WorkflowDefinition.prototype, nameof(WorkflowDefinition.prototype.workflowDirections));
ObjectList(WorkflowStep)(WorkflowDefinition.prototype, nameof(WorkflowDefinition.prototype.workflowSteps));

export * from './WorkflowDefinition';
export * from './WorkflowDefinitionFilter';

