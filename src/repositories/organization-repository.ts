import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from "config/http";
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_ORGANIZATION_PREFIX } from "config/api-consts";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Status, StatusFilter } from "models/Status";
import { Organization, OrganizationFilter } from "models/Organization";

export type KeyType = string | number;

export class OrganizationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_ORGANIZATION_PREFIX, BASE_API_URL).href;
  }

  public count = (
    organizationFilter?: OrganizationFilter
  ): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), organizationFilter)
      .pipe(Repository.responseDataMapper<number>());
  };

  public list = (
    organizationFilter?: OrganizationFilter
  ): Observable<Organization[]> => {
    return this.http
      .post<Organization[]>(kebabCase(nameof(this.list)), organizationFilter)
      .pipe(Repository.responseMapToList<Organization>(Organization));
  };
  public countAppUser = (appUserFilter?: AppUserFilter): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countAppUser)), appUserFilter)
      .pipe(Repository.responseDataMapper<number>());
  };

  public listAppUser = (
    appUserFilter?: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.listAppUser)), appUserFilter)
      .pipe(Repository.responseMapToList<AppUser>(AppUser));
  };

  public get = (
    id: number | string,
    filterType?: number
  ): Observable<Organization> => {
    return this.http
      .post<Organization>(kebabCase(nameof(this.get)), { id, filterType })
      .pipe(Repository.responseMapToModel<Organization>(Organization));
  };

  public create = (organization: Organization): Observable<Organization> => {
    return this.http
      .post<Organization>(kebabCase(nameof(this.create)), organization)
      .pipe(Repository.responseMapToModel<Organization>(Organization));
  };

  public update = (organization: Organization): Observable<Organization> => {
    return this.http
      .post<Organization>(kebabCase(nameof(this.update)), organization)
      .pipe(Repository.responseMapToModel<Organization>(Organization));
  };

  public delete = (organization: Organization): Observable<Organization> => {
    return this.http
      .post<Organization>(kebabCase(nameof(this.delete)), organization)
      .pipe(Repository.responseMapToModel<Organization>(Organization));
  };
  public deleteAppUser = (appUser: AppUser): Observable<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.deleteAppUser)), appUser)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };

  public bulkDelete = (idList: KeyType[]): Observable<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .pipe(Repository.responseDataMapper());
  };

  public save = (organization: Organization): Observable<Organization> => {
    return organization.id
      ? this.update(organization)
      : this.create(organization);
  };

  public singleListAppUser = (
    appUserFilter: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), appUserFilter)
      .pipe(Repository.responseMapToList<AppUser>(AppUser));
  };
  public singleListOrganization = (
    organizationFilter: OrganizationFilter
  ): Observable<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        organizationFilter
      )
      .pipe(Repository.responseMapToList<Organization>(Organization));
  };
  public filterListAppUser = (
    appUserFilter: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), appUserFilter)
      .pipe(Repository.responseMapToList<AppUser>(AppUser));
  };
  public singleListStatus = (): Observable<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListStatus)),
        new StatusFilter()
      )
      .pipe(Repository.responseMapToList<Status>(Status));
  };

  public filterListStatus = (
    statusFilter: StatusFilter
  ): Observable<Status[]> => {
    return this.http
      .post<Status[]>(kebabCase(nameof(this.filterListStatus)), statusFilter)
      .pipe(Repository.responseMapToList<Status>(Status));
  };

  public import = (
    file: File,
    name: string = nameof(file)
  ): Observable<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file as Blob);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData)
      .pipe(Repository.responseDataMapper<any>());
  };

  public export = (filter: any): Observable<AxiosResponse<any>> => {
    return this.http.post("export", filter, {
      responseType: "arraybuffer",
    });
  };

  public exportTemplate = (): Observable<AxiosResponse<any>> => {
    return this.http.post(
      "export-template",
      {},
      {
        responseType: "arraybuffer",
      }
    );
  };
}

export const organizationRepository = new OrganizationRepository();
