import { WorkflowDirection } from 'models/WorkflowDirection';
import { WorkflowOperator } from 'models/WorkflowOperator';
import { WorkflowParameter } from 'models/WorkflowParameter';
import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class WorkflowDirectionCondition extends Model {
    @Field(Number)
    public id?: number;


    @Field(Number)
    public workflowDirectionId?: number;


    @Field(Number)
    public workflowParameterId?: number;


    @Field(Number)
    public workflowOperatorId?: number;


    @Field(String)
    public value?: string;



    public workflowDirection?: WorkflowDirection;


    public workflowOperator?: WorkflowOperator;


    public workflowParameter?: WorkflowParameter;

}
