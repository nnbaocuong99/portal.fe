import { AppUserRoleMapping } from 'models/AppUserRoleMapping';
import { Organization } from 'models/Organization';
import { Sex } from 'models/Sex';
import { Status } from 'models/Status';
import { Moment } from 'moment';
import { Model } from 'react3l-common';
import { Field, MomentField } from 'react3l-decorators';

export class AppUser extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public username?: string;


    @Field(String)
    public password?: string;


    @Field(String)
    public otpCode?: string;



    @MomentField()
    public otpExpired?: Moment;
    @Field(String)
    public displayName?: string;


    @Field(String)
    public avatar?: string;


    @Field(String)
    public singnatureUrl?: string;



    @MomentField()
    public birthday?: Moment;
    @Field(String)
    public address?: string;


    @Field(String)
    public email?: string;


    @Field(String)
    public phone?: string;


    @Field(Number)
    public organizationId?: number;


    @Field(String)
    public department?: string;


    @Field(Number)
    public sexId?: number;


    @Field(Number)
    public statusId?: number;



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


    @Field(Boolean)
    public isLdap?: boolean;



    public organization?: Organization;


    public sex?: Sex;


    public status?: Status;


    public appUserRoleMappings?: AppUserRoleMapping[];





}
