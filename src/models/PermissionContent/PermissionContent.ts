import { FieldModel } from 'models/FieldModel';
import { Permission } from 'models/Permission';
import { PermissionOperator } from 'models/PermissionOperator';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class PermissionContent extends Model {
    @Field(Number)
    public id?: number;


    @Field(Number)
    public permissionId?: number;


    @Field(Number)
    public fieldId?: number;


    @Field(Number)
    public permissionOperatorId?: number;


    @Field(String)
    public value?: string;



    public field?: FieldModel;


    public permission?: Permission;


    public permissionOperator?: PermissionOperator;

}
