import { AppUser } from "models/AppUser";
import { Moment } from "moment";
import { Model } from "react3l-common";
import { Field, MomentField } from "react3l-decorators";

export class UserNotification extends Model {
  @Field(Number)
  public id?: number;

  @Field(String)
  public titleWeb?: string;

  @Field(String)
  public titleMobile?: string;

  @Field(String)
  public contentWeb?: string;

  @Field(String)
  public contentMobile?: string;

  @Field(String)
  public linkWebsite?: string;

  @Field(String)
  public linkMobile?: string;

  @Field(Number)
  public senderId?: number;

  @Field(Number)
  public recipientId?: number;

  public unread?: boolean;

  @MomentField()
  public time?: Moment;

  public sender?: AppUser;

  public recipient?: AppUser;

  @Field(Number)
  public siteId?: number;
}
