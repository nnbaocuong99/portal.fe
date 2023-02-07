import { Model } from 'react3l-common';
import { Field, MomentField } from 'react3l-decorators';
import { Moment } from 'moment';
import { Status } from 'models/Status';

export class Province extends Model
{
    @Field(Number)
    public id?: number;


    @Field(String)
    public code?: string;


    @Field(String)
    public name?: string;


    @Field(Number)
    public priority?: number;


    @Field(Number)
    public statusId?: number = 1;



    @MomentField()
    public createdAt?: Moment;

    @MomentField()
    public updatedAt?: Moment;

    @MomentField()
    public deletedAt?: Moment;
    @Field(String)
    public rowId?: string;


    @Field(Boolean)
    public used?: boolean;



    public status?: Status;





}
