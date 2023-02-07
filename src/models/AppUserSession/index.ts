import { AppUser } from 'models/AppUser';
import { Status } from 'models/Status';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { AppUserSession } from './AppUserSession';


ObjectField(AppUser)(AppUserSession.prototype, nameof(AppUserSession.prototype.appUser));
ObjectField(Status)(AppUserSession.prototype, nameof(AppUserSession.prototype.status));

export * from './AppUserSession';
export * from './AppUserSessionFilter';

