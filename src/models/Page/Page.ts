import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class Page extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public name?: string;


    @Field(String)
    public path?: string;


    @Field(Boolean)
    public isDeleted?: boolean;




}
