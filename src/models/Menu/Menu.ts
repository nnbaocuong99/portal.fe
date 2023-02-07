import { FieldModel } from 'models/FieldModel';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class Menu extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public code?: string;


    @Field(String)
    public name?: string;


    @Field(String)
    public path?: string;


    @Field(Boolean)
    public isDeleted?: boolean;





    public fields?: FieldModel[];



}
