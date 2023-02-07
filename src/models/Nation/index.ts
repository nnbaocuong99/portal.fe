import { Nation } from './Nation'
import nameof from 'ts-nameof.macro';
import { ObjectField,  } from 'react3l-decorators';

import { Status } from 'models/Status';

ObjectField(Status)(Nation.prototype, nameof(Nation.prototype.status));

export * from './Nation';
export * from './NationFilter';
