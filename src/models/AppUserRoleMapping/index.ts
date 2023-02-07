import { AppUser } from 'models/AppUser';
import { Role } from 'models/Role';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { AppUserRoleMapping } from './AppUserRoleMapping';


ObjectField(AppUser)(AppUserRoleMapping.prototype, nameof(AppUserRoleMapping.prototype.appUser));
ObjectField(Role)(AppUserRoleMapping.prototype, nameof(AppUserRoleMapping.prototype.role));

export * from './AppUserRoleMapping';
export * from './AppUserRoleMappingFilter';

