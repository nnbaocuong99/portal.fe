import { Menu } from 'models/Menu';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { Action } from './Action';


ObjectField(Menu)(Action.prototype, nameof(Action.prototype.menu));

export * from './Action';
export * from './ActionFilter';

