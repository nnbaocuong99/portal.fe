import { FieldModel } from 'models/FieldModel';
import { Permission } from 'models/Permission';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class PermissionFieldMapping extends Model {
    @Field(Number)
    public permissionId?: number;


    @Field(Number)
    public fieldId?: number;


    @Field(String)
    public value?: string;



    public field?: FieldModel;


    public permission?: Permission;

}
