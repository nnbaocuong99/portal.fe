import { FieldModel } from './FieldModel'
import nameof from 'ts-nameof.macro';
import { ObjectField, } from 'react3l-decorators';

import { FieldType } from 'models/FieldType';
import { Menu } from 'models/Menu';

ObjectField(FieldType)(FieldModel.prototype, nameof(FieldModel.prototype.fieldType));
ObjectField(Menu)(FieldModel.prototype, nameof(FieldModel.prototype.menu));

export * from './FieldModel';
export * from './FieldModelFilter';
