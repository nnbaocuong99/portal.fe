import { Ward } from './Ward'
import nameof from 'ts-nameof.macro';
import { ObjectField,  } from 'react3l-decorators';

import { District } from 'models/District';
import { Status } from 'models/Status';

ObjectField(District)(Ward.prototype, nameof(Ward.prototype.district));
ObjectField(Status)(Ward.prototype, nameof(Ward.prototype.status));

export * from './Ward';
export * from './WardFilter';
