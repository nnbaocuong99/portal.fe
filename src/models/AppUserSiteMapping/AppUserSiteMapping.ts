import { AppUser } from 'models/AppUser';
import { Site } from 'models/Site';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class AppUserSiteMapping extends Model {
    @Field(Number)
    public appUserId?: number;


    @Field(Number)
    public siteId?: number;


    @Field(Boolean)
    public enabled?: boolean;



    public appUser?: AppUser;


    public site?: Site;

}
