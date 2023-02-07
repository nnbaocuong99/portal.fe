import { FieldModel } from 'models/FieldModel';
import { ObjectList } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { Menu } from './Menu';


ObjectList(FieldModel)(Menu.prototype, nameof(Menu.prototype.fields));

export * from './Menu';
export * from './MenuFilter';

