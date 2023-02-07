import { Status } from 'models/Status';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { WorkflowDirectionCondition } from 'models/WorkflowDirectionCondition';
import { WorkflowStep } from 'models/WorkflowStep';
import { Moment } from 'moment';
import { Model } from 'react3l-common';
import { Field, MomentField } from 'react3l-decorators';

export class WorkflowDirection extends Model {
    @Field(Number)
    public id?: number;


    @Field(Number)
    public workflowDefinitionId?: number;


    @Field(Number)
    public fromStepId?: number;


    @Field(Number)
    public toStepId?: number;


    @Field(String)
    public subjectMailForCreator?: string;


    @Field(String)
    public subjectMailForCurrentStep?: string;


    @Field(String)
    public subjectMailForNextStep?: string;


    @Field(String)
    public bodyMailForCreator?: string;


    @Field(String)
    public bodyMailForCurrentStep?: string;


    @Field(String)
    public bodyMailForNextStep?: string;


    @Field(Number)
    public statusId?: number;



    @MomentField()
    public updatedAt?: Moment;
    @Field(String)
    public rowId?: string;



    public fromStep?: WorkflowStep;


    public status?: Status;


    public toStep?: WorkflowStep;


    public workflowDefinition?: WorkflowDefinition;


    public workflowDirectionConditions?: WorkflowDirectionCondition[];

}
