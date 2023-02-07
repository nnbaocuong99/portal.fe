import { FieldModel } from 'models/FieldModel';
import { Permission } from 'models/Permission';
import { PermissionOperator } from 'models/PermissionOperator';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { PermissionContent } from './PermissionContent';


ObjectField(FieldModel)(PermissionContent.prototype, nameof(PermissionContent.prototype.field));
ObjectField(Permission)(PermissionContent.prototype, nameof(PermissionContent.prototype.permission));
ObjectField(PermissionOperator)(PermissionContent.prototype, nameof(PermissionContent.prototype.permissionOperator));

export * from './PermissionContent';
export * from './PermissionContentFilter';

