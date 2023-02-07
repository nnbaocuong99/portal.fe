import { Action } from 'models/Action';
import { Permission } from 'models/Permission';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { PermissionActionMapping } from './PermissionActionMapping';


ObjectField(Action)(PermissionActionMapping.prototype, nameof(PermissionActionMapping.prototype.action));
ObjectField(Permission)(PermissionActionMapping.prototype, nameof(PermissionActionMapping.prototype.permission));

export * from './PermissionActionMapping';
export * from './PermissionActionMappingFilter';

