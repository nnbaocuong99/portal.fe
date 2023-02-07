import { IdFilter, StringFilter } from 'react3l-advanced-filters';
import { ModelFilter } from 'react3l-common';

export class ProviderFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public googleRedirectUri?: StringFilter = new StringFilter();
  public aDIP?: StringFilter = new StringFilter();
  public aDUsername?: StringFilter = new StringFilter();
  public aDPassword?: StringFilter = new StringFilter();
  public googleClient?: StringFilter = new StringFilter();
  public googleClientSecret?: StringFilter = new StringFilter();
  public microsoftClient?: StringFilter = new StringFilter();
  public microsoftClientSecret?: StringFilter = new StringFilter();
  public microsoftRedirectUri?: StringFilter = new StringFilter();
}
