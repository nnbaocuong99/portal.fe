import { WorkflowParameterType } from 'models/WorkflowParameterType';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class WorkflowOperator extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public code?: string;


    @Field(String)
    public name?: string;


    @Field(Number)
    public workflowParameterTypeId?: number;



    public workflowParameterType?: WorkflowParameterType;



}
