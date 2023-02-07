import { Role } from 'models/Role';
import { Status } from 'models/Status';
import { WorkflowDefinition } from 'models/WorkflowDefinition';
import { Moment } from 'moment';
import { Model } from 'react3l-common';
import { Field, MomentField } from 'react3l-decorators';

export class WorkflowStep extends Model {
    @Field(Number)
    public id?: number;


    @Field(Number)
    public workflowDefinitionId?: number;


    @Field(String)
    public code?: string;


    @Field(String)
    public name?: string;


    @Field(Number)
    public roleId?: number;


    @Field(String)
    public subjectMailForReject?: string;


    @Field(String)
    public bodyMailForReject?: string;


    @Field(Number)
    public statusId?: number = 1;



    @MomentField()
    public createdAt?: Moment;

    @MomentField()
    public updatedAt?: Moment;

    @MomentField()
    public deletedAt?: Moment;

    public role?: Role;


    public status?: Status;


    public workflowDefinition?: WorkflowDefinition;





}
