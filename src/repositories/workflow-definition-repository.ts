import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from "config/http";
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_WORKFLOW_DEFINITION_PREFIX } from "config/api-consts";
import {
  WorkflowDefinition,
  WorkflowDefinitionFilter,
} from "models/WorkflowDefinition";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Organization, OrganizationFilter } from "models/Organization";
import { Site, SiteFilter } from "models/Site";
import { Status, StatusFilter } from "models/Status";
import { WorkflowType, WorkflowTypeFilter } from "models/WorkflowType";
import {
  WorkflowDirection,
  WorkflowDirectionFilter,
} from "models/WorkflowDirection";
import { WorkflowStep, WorkflowStepFilter } from "models/WorkflowStep";
import { Role, RoleFilter } from "models/Role";

export type KeyType = string | number;

export class WorkflowDefinitionRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_WORKFLOW_DEFINITION_PREFIX, BASE_API_URL).href;
  }

  public count = (
    workflowDefinitionFilter?: WorkflowDefinitionFilter
  ): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), workflowDefinitionFilter)
      .pipe(Repository.responseDataMapper<number>());
  };

  public list = (
    workflowDefinitionFilter?: WorkflowDefinitionFilter
  ): Observable<WorkflowDefinition[]> => {
    return this.http
      .post<WorkflowDefinition[]>(
        kebabCase(nameof(this.list)),
        workflowDefinitionFilter
      )
      .pipe(
        Repository.responseMapToList<WorkflowDefinition>(WorkflowDefinition)
      );
  };

  public get = (id: number | string): Observable<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(kebabCase(nameof(this.get)), { id })
      .pipe(
        Repository.responseMapToModel<WorkflowDefinition>(WorkflowDefinition)
      );
  };

  public create = (
    workflowDefinition: WorkflowDefinition
  ): Observable<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(
        kebabCase(nameof(this.create)),
        workflowDefinition
      )
      .pipe(
        Repository.responseMapToModel<WorkflowDefinition>(WorkflowDefinition)
      );
  };

  public clone = (id: number | string): Observable<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(kebabCase(nameof(this.clone)), { id })
      .pipe(
        Repository.responseMapToModel<WorkflowDefinition>(WorkflowDefinition)
      );
  };

  public update = (
    workflowDefinition: WorkflowDefinition
  ): Observable<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(
        kebabCase(nameof(this.update)),
        workflowDefinition
      )
      .pipe(
        Repository.responseMapToModel<WorkflowDefinition>(WorkflowDefinition)
      );
  };

  public delete = (
    workflowDefinition: WorkflowDefinition
  ): Observable<WorkflowDefinition> => {
    return this.http
      .post<WorkflowDefinition>(
        kebabCase(nameof(this.delete)),
        workflowDefinition
      )
      .pipe(
        Repository.responseMapToModel<WorkflowDefinition>(WorkflowDefinition)
      );
  };

  public bulkDelete = (idList: KeyType[]): Observable<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .pipe(Repository.responseDataMapper());
  };

  public save = (
    workflowDefinition: WorkflowDefinition
  ): Observable<WorkflowDefinition> => {
    return workflowDefinition.id
      ? this.update(workflowDefinition)
      : this.create(workflowDefinition);
  };

  public singleListAppUser = (
    appUserFilter: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), appUserFilter)
      .pipe(Repository.responseMapToList<AppUser>(AppUser));
  };
  public filterListAppUser = (
    appUserFilter: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), appUserFilter)
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
  public filterListOrganization = (
    organizationFilter: OrganizationFilter
  ): Observable<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.filterListOrganization)),
        organizationFilter
      )
      .pipe(Repository.responseMapToList<Organization>(Organization));
  };
  public singleListSite = (siteFilter: SiteFilter): Observable<Site[]> => {
    return this.http
      .post<Site[]>(kebabCase(nameof(this.singleListSite)), siteFilter)
      .pipe(Repository.responseMapToList<Site>(Site));
  };
  public filterListSite = (siteFilter: SiteFilter): Observable<Site[]> => {
    return this.http
      .post<Site[]>(kebabCase(nameof(this.filterListSite)), siteFilter)
      .pipe(Repository.responseMapToList<Site>(Site));
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
  public singleListWorkflowType = (
    workflowTypeFilter: WorkflowTypeFilter
  ): Observable<WorkflowType[]> => {
    return this.http
      .post<WorkflowType[]>(
        kebabCase(nameof(this.singleListWorkflowType)),
        workflowTypeFilter
      )
      .pipe(Repository.responseMapToList<WorkflowType>(WorkflowType));
  };
  public filterListWorkflowType = (
    workflowTypeFilter: WorkflowTypeFilter
  ): Observable<WorkflowType[]> => {
    return this.http
      .post<WorkflowType[]>(
        kebabCase(nameof(this.filterListWorkflowType)),
        workflowTypeFilter
      )
      .pipe(Repository.responseMapToList<WorkflowType>(WorkflowType));
  };
  public singleListWorkflowDirection = (
    workflowDirectionFilter: WorkflowDirectionFilter
  ): Observable<WorkflowDirection[]> => {
    return this.http
      .post<WorkflowDirection[]>(
        kebabCase(nameof(this.singleListWorkflowDirection)),
        workflowDirectionFilter
      )
      .pipe(Repository.responseMapToList<WorkflowDirection>(WorkflowDirection));
  };
  public filterListWorkflowDirection = (
    workflowDirectionFilter: WorkflowDirectionFilter
  ): Observable<WorkflowDirection[]> => {
    return this.http
      .post<WorkflowDirection[]>(
        kebabCase(nameof(this.filterListWorkflowDirection)),
        workflowDirectionFilter
      )
      .pipe(Repository.responseMapToList<WorkflowDirection>(WorkflowDirection));
  };
  public singleListWorkflowStep = (
    workflowStepFilter: WorkflowStepFilter
  ): Observable<WorkflowStep[]> => {
    return this.http
      .post<WorkflowStep[]>(
        kebabCase(nameof(this.singleListWorkflowStep)),
        workflowStepFilter
      )
      .pipe(Repository.responseMapToList<WorkflowStep>(WorkflowStep));
  };
  public filterListWorkflowStep = (
    workflowStepFilter: WorkflowStepFilter
  ): Observable<WorkflowStep[]> => {
    return this.http
      .post<WorkflowStep[]>(
        kebabCase(nameof(this.filterListWorkflowStep)),
        workflowStepFilter
      )
      .pipe(Repository.responseMapToList<WorkflowStep>(WorkflowStep));
  };
  public singleListRole = (roleFilter: RoleFilter): Observable<Role[]> => {
    return this.http
      .post<Role[]>(kebabCase(nameof(this.singleListRole)), roleFilter)
      .pipe(Repository.responseMapToList<Role>(Role));
  };
  public filterListRole = (roleFilter: RoleFilter): Observable<Role[]> => {
    return this.http
      .post<Role[]>(kebabCase(nameof(this.filterListRole)), roleFilter)
      .pipe(Repository.responseMapToList<Role>(Role));
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

export const workflowDefinitionRepository = new WorkflowDefinitionRepository();
