import { Model } from 'react3l-common';
import { Field } from 'react3l-decorators';

export class Provider extends Model {
    @Field(Number)
    public id?: number;


    @Field(String)
    public name?: string;


    @Field(String)
    public googleRedirectUri?: string;


    @Field(String)
    public aDIP?: string;


    @Field(String)
    public aDUsername?: string;


    @Field(String)
    public aDPassword?: string;


    @Field(String)
    public googleClient?: string;


    @Field(String)
    public googleClientSecret?: string;


    @Field(String)
    public microsoftClient?: string;


    @Field(String)
    public microsoftClientSecret?: string;


    @Field(String)
    public microsoftRedirectUri?: string;


}
