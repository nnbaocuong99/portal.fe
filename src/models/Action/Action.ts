import { Menu } from 'models/Menu';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class Action extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public name?: string;


    @Field(Number)
    public menuId?: number;


    @Field(Boolean)
    public isDeleted?: boolean;



    public menu?: Menu;





}
