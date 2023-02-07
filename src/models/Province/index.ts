import { Province } from './Province'
import nameof from 'ts-nameof.macro';
import { ObjectField,  } from 'react3l-decorators';

import { Status } from 'models/Status';

ObjectField(Status)(Province.prototype, nameof(Province.prototype.status));

export * from './Province';
export * from './ProvinceFilter';
