import { FieldType } from 'models/FieldType';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { PermissionOperator } from './PermissionOperator';


ObjectField(FieldType)(PermissionOperator.prototype, nameof(PermissionOperator.prototype.fieldType));

export * from './PermissionOperator';
export * from './PermissionOperatorFilter';

