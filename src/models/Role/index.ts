import { AppUserRoleMapping } from 'models/AppUserRoleMapping';
import { Permission } from 'models/Permission';
import { Status } from 'models/Status';
import { ObjectField, ObjectList } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { Role } from './Role';


ObjectField(Status)(Role.prototype, nameof(Role.prototype.status));
ObjectList(AppUserRoleMapping)(Role.prototype, nameof(Role.prototype.appUserRoleMappings));
ObjectList(Permission)(Role.prototype, nameof(Role.prototype.permissions));

export * from './Role';
export * from './RoleFilter';

