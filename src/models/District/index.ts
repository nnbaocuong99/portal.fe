import { District } from './District'
import nameof from 'ts-nameof.macro';
import { ObjectField,  } from 'react3l-decorators';

import { Province } from 'models/Province';
import { Status } from 'models/Status';

ObjectField(Province)(District.prototype, nameof(District.prototype.province));
ObjectField(Status)(District.prototype, nameof(District.prototype.status));

export * from './District';
export * from './DistrictFilter';
