import { AppUser } from 'models/AppUser';
import { Status } from 'models/Status';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class AppUserSession extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public refreshToken?: string;


    @Field(Number)
    public appUserId?: number;


    @Field(String)
    public deviceName?: string;


    @Field(Number)
    public statusId?: number;



    public appUser?: AppUser;


    public status?: Status;

}
