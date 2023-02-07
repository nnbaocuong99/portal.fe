import { Moment } from 'moment';
import { Model } from 'react3l-common';
import { Field, MomentField } from 'react3l-decorators';

export class MasterEntity extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public code?: string;


    @Field(String)
    public name?: string;



    @MomentField()
    public createdAt?: Moment;

    @MomentField()
    public updatedAt?: Moment;

    @MomentField()
    public deletedAt?: Moment;
    @Field(Number)
    public statusId?: number;


    @Field(Number)
    public isTree?: number;




}
