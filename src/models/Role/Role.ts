import { AppUserRoleMapping } from "models/AppUserRoleMapping";
import { Permission } from "models/Permission";
import { Site } from "models/Site";
import { Status } from "models/Status";
import { Model } from "react3l-common";
import { Field } from "react3l-decorators";

export class Role extends Model {
  @Field(Number)
  public id?: number;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(Number)
  public statusId?: number = 1;

  @Field(Number)
  public siteId?: number;

  @Field(Boolean)
  public used?: boolean;

  public status?: Status;

  public site?: Site;

  public appUserRoleMappings?: AppUserRoleMapping[];

  public permissions?: Permission[];
}
