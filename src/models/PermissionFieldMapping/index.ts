import { FieldModel } from 'models/FieldModel';
import { Permission } from 'models/Permission';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { PermissionFieldMapping } from './PermissionFieldMapping';


ObjectField(FieldModel)(PermissionFieldMapping.prototype, nameof(PermissionFieldMapping.prototype.field));
ObjectField(Permission)(PermissionFieldMapping.prototype, nameof(PermissionFieldMapping.prototype.permission));

export * from './PermissionFieldMapping';
export * from './PermissionFieldMappingFilter';

