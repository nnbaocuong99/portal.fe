import { Model } from "react3l-common";
import { Field } from "react3l-decorators";

export class Site extends Model {
  @Field(Number)
  public id?: number;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public description?: string;

  @Field(String)
  public icon?: string;

  @Field(String)
  public logo?: string;

  @Field(Boolean)
  public isDisplay?: boolean;

  @Field(String)
  public colorCode?: string;

  @Field(Number)
  public themeId?: number;

  @Field(String)
  public rowId?: string;

  @Field(String)
  public lightIcon?: string;

  @Field(String)
  public lightLogo?: string;

  @Field(String)
  public darkIcon?: string;

  @Field(String)
  public darkLogo?: string;
}
