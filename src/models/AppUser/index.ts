import { AppUserRoleMapping } from 'models/AppUserRoleMapping';
import { Organization } from 'models/Organization';
import { Sex } from 'models/Sex';
import { Status } from 'models/Status';
import { ObjectField, ObjectList } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { AppUser } from './AppUser';


ObjectField(Organization)(AppUser.prototype, nameof(AppUser.prototype.organization));
ObjectField(Sex)(AppUser.prototype, nameof(AppUser.prototype.sex));
ObjectField(Status)(AppUser.prototype, nameof(AppUser.prototype.status));
ObjectList(AppUserRoleMapping)(AppUser.prototype, nameof(AppUser.prototype.appUserRoleMappings));

export * from './AppUser';
export * from './AppUserFilter';

