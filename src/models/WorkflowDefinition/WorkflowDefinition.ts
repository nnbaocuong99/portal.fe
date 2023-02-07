import { AppUser } from 'models/AppUser';
import { Organization } from 'models/Organization';
import { Site } from 'models/Site';
import { Status } from 'models/Status';
import { WorkflowDirection } from 'models/WorkflowDirection';
import { WorkflowStep } from 'models/WorkflowStep';
import { WorkflowType } from 'models/WorkflowType';
import { Moment } from 'moment';
import { Model } from 'react3l-common';
import { Field, MomentField } from 'react3l-decorators';

export class WorkflowDefinition extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public code?: string;


    @Field(String)
    public name?: string;


    @Field(Number)
    public creatorId?: number;


    @Field(Number)
    public modifierId?: number;


    @Field(Number)
    public workflowTypeId?: number;


    @Field(Number)
    public organizationId?: number;


    @Field(Number)
    public siteId?: number;



    @MomentField()
    public startDate?: Moment;

    @MomentField()
    public endDate?: Moment;
    @Field(Number)
    public statusId?: number;



    @MomentField()
    public createdAt?: Moment;

    @MomentField()
    public updatedAt?: Moment;

    @MomentField()
    public deletedAt?: Moment;
    @Field(Boolean)
    public used?: boolean;



    public creator?: AppUser;


    public modifier?: AppUser;


    public organization?: Organization;


    public site?: Site;


    public status?: Status;


    public workflowType?: WorkflowType;


    public workflowDirections?: WorkflowDirection[];


    public workflowSteps?: WorkflowStep[];

}
