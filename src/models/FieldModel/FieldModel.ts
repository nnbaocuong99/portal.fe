import { FieldType } from 'models/FieldType';
import { Menu } from 'models/Menu';
import { Model } from 'react3l-common';
import { Field as field } from 'react3l-decorators';

export class FieldModel extends Model {
    @field(Number)
    public id?: number;


    @field(String)
    public name?: string;


    @field(Number)
    public fieldTypeId?: number;


    @field(Number)
    public menuId?: number;


    public isDeleted?: boolean;



    public fieldType?: FieldType;


    public menu?: Menu;





}
