import { AppUser } from 'models/AppUser';
import { Role } from 'models/Role';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class AppUserRoleMapping extends Model {
    @Field(Number)
    public appUserId?: number;


    @Field(Number)
    public roleId?: number;



    public appUser?: AppUser;


    public role?: Role;

}
