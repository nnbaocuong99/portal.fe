import { Model } from "react3l-common";
import { Field } from "react3l-decorators";

export class LDAPConfiguration extends Model {
  @Field(String)
  public _CONNECTION_STRING?: string;

  @Field(String)
  public _BASE_DN?: string;

  @Field(String)
  public _ADMIN_USERNAME?: string;

  @Field(String)
  public _ADMIN_PASSWORD?: string;
}
