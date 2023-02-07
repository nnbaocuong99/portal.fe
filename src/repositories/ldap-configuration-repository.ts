import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from "config/http";
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";

import nameof from "ts-nameof.macro";

import { API_LDAP_CONFIGURATION_PREFIX } from "config/api-consts";
import { LDAPConfiguration } from "models/LDAPConfiguration";

export type KeyType = string | number;

export class LDAPConfigurationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_LDAP_CONFIGURATION_PREFIX, BASE_API_URL).href;
  }

  public get = (): Observable<LDAPConfiguration> => {
    return this.http
      .post<LDAPConfiguration>(kebabCase(nameof(this.get)))
      .pipe(
        Repository.responseMapToModel<LDAPConfiguration>(LDAPConfiguration)
      );
  };

  public update = (
    nation: LDAPConfiguration
  ): Observable<LDAPConfiguration> => {
    return this.http
      .post<LDAPConfiguration>(kebabCase(nameof(this.update)), nation)
      .pipe(
        Repository.responseMapToModel<LDAPConfiguration>(LDAPConfiguration)
      );
  };
}

export const ldapConfigurationRepository = new LDAPConfigurationRepository();
