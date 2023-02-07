import { Status } from 'models/Status';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { Organization } from './Organization';


ObjectField(Organization)(Organization.prototype, nameof(Organization.prototype.parent));
ObjectField(Status)(Organization.prototype, nameof(Organization.prototype.status));

export * from './Organization';
export * from './OrganizationFilter';

