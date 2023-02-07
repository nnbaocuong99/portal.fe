import { WorkflowParameterType } from 'models/WorkflowParameterType';
import { WorkflowType } from 'models/WorkflowType';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class WorkflowParameter extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public code?: string;


    @Field(String)
    public name?: string;


    @Field(Number)
    public workflowTypeId?: number;


    @Field(Number)
    public workflowParameterTypeId?: number;



    public workflowParameterType?: WorkflowParameterType;


    public workflowType?: WorkflowType;



}
