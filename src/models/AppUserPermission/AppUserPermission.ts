import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class AppUserPermission extends Model {
    @Field(Number)
    public permissionId?: number;


    @Field(Number)
    public appUserId?: number;


    @Field(String)
    public path?: string;


    @Field(Number)
    public count?: number;


}
