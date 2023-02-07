import { MasterEntity } from 'models/MasterEntity';
import { Moment } from 'moment';
import { Model } from 'react3l-common';
import { Field, MomentField } from 'react3l-decorators';

export class MasterData extends Model {
    @Field(Number)
    public id?: number;


    @Field(Number)
    public masterEntityId?: number;


    @Field(Number)
    public entityId?: number;


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


    @Field(String)
    public path?: string;


    @Field(Number)
    public level?: number;


    @Field(Number)
    public parentId?: number;


    @Field(Boolean)
    public hasChildren?: boolean;



    public masterEntity?: MasterEntity;

}
