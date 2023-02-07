import { Status } from 'models/Status';
import { Moment } from 'moment';
import { Model } from 'react3l-common';
import { Field, MomentField } from 'react3l-decorators';

export class Organization extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public code?: string;


    @Field(String)
    public name?: string;


    @Field(Number)
    public parentId?: number;


    @Field(String)
    public path?: string;


    @Field(Number)
    public level?: number;


    @Field(Number)
    public statusId?: number;


    @Field(String)
    public phone?: string;


    @Field(String)
    public email?: string;


    @Field(String)
    public avatar?: string;


    @Field(String)
    public address?: string;


    @Field(String)
    public taxCode?: string;



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



    public parent?: Organization;


    public status?: Status;





}
