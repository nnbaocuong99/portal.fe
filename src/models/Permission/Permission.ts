import { Menu } from 'models/Menu';
import { PermissionActionMapping } from 'models/PermissionActionMapping';
import { PermissionFieldMapping } from 'models/PermissionFieldMapping';
import { Role } from 'models/Role';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class Permission extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public code?: string;


    @Field(String)
    public name?: string;


    @Field(Number)
    public roleId?: number;


    @Field(Number)
    public menuId?: number;


    @Field(Number)
    public statusId?: number = 1;



    public menu?: Menu;


    public role?: Role;


    public permissionActionMappings?: PermissionActionMapping[];




    public permissionFieldMappings?: PermissionFieldMapping[];

}
