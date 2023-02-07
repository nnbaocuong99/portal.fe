import { Action } from 'models/Action';
import { Page } from 'models/Page';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class ActionPageMapping extends Model {
    @Field(Number)
    public pageId?: number;


    @Field(Number)
    public actionId?: number;



    public action?: Action;


    public page?: Page;

}
