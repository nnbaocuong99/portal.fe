import { Menu } from 'models/Menu';
import { PermissionActionMapping } from 'models/PermissionActionMapping';
import { PermissionFieldMapping } from 'models/PermissionFieldMapping';
import { Role } from 'models/Role';
import { ObjectField, ObjectList } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { Permission } from './Permission';


ObjectField(Menu)(Permission.prototype, nameof(Permission.prototype.menu));
ObjectField(Role)(Permission.prototype, nameof(Permission.prototype.role));
ObjectList(PermissionActionMapping)(Permission.prototype, nameof(Permission.prototype.permissionActionMappings));
ObjectList(PermissionFieldMapping)(Permission.prototype, nameof(Permission.prototype.permissionFieldMappings));

export * from './Permission';
export * from './PermissionFilter';

