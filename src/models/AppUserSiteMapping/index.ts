import { AppUser } from 'models/AppUser';
import { Site } from 'models/Site';
import { ObjectField } from 'react3l-decorators';
import nameof from 'ts-nameof.macro';
import { AppUserSiteMapping } from './AppUserSiteMapping';


ObjectField(AppUser)(AppUserSiteMapping.prototype, nameof(AppUserSiteMapping.prototype.appUser));
ObjectField(Site)(AppUserSiteMapping.prototype, nameof(AppUserSiteMapping.prototype.site));

export * from './AppUserSiteMapping';
export * from './AppUserSiteMappingFilter';

