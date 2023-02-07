import { Action } from 'models/Action';
import { Permission } from 'models/Permission';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class PermissionActionMapping extends Model {
    @Field(Number)
    public permissionId?: number;


    @Field(Number)
    public actionId?: number;



    public action?: Action;


    public permission?: Permission;

}
