import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from "config/http";
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_WORKFLOW_DIRECTION_PREFIX } from "config/api-consts";
import {
  WorkflowDirection,
  WorkflowDirectionFilter,
} from "models/WorkflowDirection";
import { WorkflowStep, WorkflowStepFilter } from "models/WorkflowStep";
import { Status, StatusFilter } from "models/Status";
import {
  WorkflowDefinition,
  WorkflowDefinitionFilter,
} from "models/WorkflowDefinition";
import {
  WorkflowDirectionCondition,
  WorkflowDirectionConditionFilter,
} from "models/WorkflowDirectionCondition";
import {
  WorkflowOperator,
  WorkflowOperatorFilter,
} from "models/WorkflowOperator";
import {
  WorkflowParameter,
  WorkflowParameterFilter,
} from "models/WorkflowParameter";
import { Organization, OrganizationFilter } from "models/Organization";
import { AppUser, AppUserFilter } from "models/AppUser";
import { MasterData, MasterDataFilter } from "models/MasterData";

export type KeyType = string | number;

export class WorkflowDirectionRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_WORKFLOW_DIRECTION_PREFIX, BASE_API_URL).href;
  }

  public count = (
    workflowDirectionFilter?: WorkflowDirectionFilter
  ): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), workflowDirectionFilter)
      .pipe(Repository.responseDataMapper<number>());
  };

  public list = (
    workflowDirectionFilter?: WorkflowDirectionFilter
  ): Observable<WorkflowDirection[]> => {
    return this.http
      .post<WorkflowDirection[]>(
        kebabCase(nameof(this.list)),
        workflowDirectionFilter
      )
      .pipe(Repository.responseMapToList<WorkflowDirection>(WorkflowDirection));
  };

  public get = (id: number | string): Observable<WorkflowDirection> => {
    return this.http
      .post<WorkflowDirection>(kebabCase(nameof(this.get)), { id })
      .pipe(
        Repository.responseMapToModel<WorkflowDirection>(WorkflowDirection)
      );
  };
  public getSingleListApi = (model: any): Observable<any> => {
    return this.http
      .post<any>(kebabCase(nameof(this.getSingleListApi)), model)
      .pipe(
        Repository.responseMapToModel<WorkflowDirection>(WorkflowDirection)
      );
  };

  public create = (
    workflowDirection: WorkflowDirection
  ): Observable<WorkflowDirection> => {
    return this.http
      .post<WorkflowDirection>(
        kebabCase(nameof(this.create)),
        workflowDirection
      )
      .pipe(
        Repository.responseMapToModel<WorkflowDirection>(WorkflowDirection)
      );
  };

  public update = (
    workflowDirection: WorkflowDirection
  ): Observable<WorkflowDirection> => {
    return this.http
      .post<WorkflowDirection>(
        kebabCase(nameof(this.update)),
        workflowDirection
      )
      .pipe(
        Repository.responseMapToModel<WorkflowDirection>(WorkflowDirection)
      );
  };

  public delete = (
    workflowDirection: WorkflowDirection
  ): Observable<WorkflowDirection> => {
    return this.http
      .post<WorkflowDirection>(
        kebabCase(nameof(this.delete)),
        workflowDirection
      )
      .pipe(
        Repository.responseMapToModel<WorkflowDirection>(WorkflowDirection)
      );
  };

  public bulkDelete = (idList: KeyType[]): Observable<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .pipe(Repository.responseDataMapper());
  };

  public save = (
    workflowDirection: WorkflowDirection
  ): Observable<WorkflowDirection> => {
    return workflowDirection.id
      ? this.update(workflowDirection)
      : this.create(workflowDirection);
  };

  public singleListOrganization = (
    organizationFilter: OrganizationFilter
  ): Observable<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        organizationFilter
      )
      .pipe(Repository.responseMapToList<WorkflowStep>(WorkflowStep));
  };
  public singleListAppUser = (
    appUserFilter: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), appUserFilter)
      .pipe(Repository.responseMapToList<WorkflowStep>(WorkflowStep));
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
  public singleListWorkflowDefinition = (
    workflowDefinitionFilter: WorkflowDefinitionFilter
  ): Observable<WorkflowDefinition[]> => {
    return this.http
      .post<WorkflowDefinition[]>(
        kebabCase(nameof(this.singleListWorkflowDefinition)),
        workflowDefinitionFilter
      )
      .pipe(
        Repository.responseMapToList<WorkflowDefinition>(WorkflowDefinition)
      );
  };
  public filterListWorkflowDefinition = (
    workflowDefinitionFilter: WorkflowDefinitionFilter
  ): Observable<WorkflowDefinition[]> => {
    return this.http
      .post<WorkflowDefinition[]>(
        kebabCase(nameof(this.filterListWorkflowDefinition)),
        workflowDefinitionFilter
      )
      .pipe(
        Repository.responseMapToList<WorkflowDefinition>(WorkflowDefinition)
      );
  };
  public singleListWorkflowDirectionCondition = (
    workflowDirectionConditionFilter: WorkflowDirectionConditionFilter
  ): Observable<WorkflowDirectionCondition[]> => {
    return this.http
      .post<WorkflowDirectionCondition[]>(
        kebabCase(nameof(this.singleListWorkflowDirectionCondition)),
        workflowDirectionConditionFilter
      )
      .pipe(
        Repository.responseMapToList<WorkflowDirectionCondition>(
          WorkflowDirectionCondition
        )
      );
  };
  public filterListWorkflowDirectionCondition = (
    workflowDirectionConditionFilter: WorkflowDirectionConditionFilter
  ): Observable<WorkflowDirectionCondition[]> => {
    return this.http
      .post<WorkflowDirectionCondition[]>(
        kebabCase(nameof(this.filterListWorkflowDirectionCondition)),
        workflowDirectionConditionFilter
      )
      .pipe(
        Repository.responseMapToList<WorkflowDirectionCondition>(
          WorkflowDirectionCondition
        )
      );
  };
  public singleListWorkflowOperator = (
    workflowOperatorFilter: WorkflowOperatorFilter
  ): Observable<WorkflowOperator[]> => {
    return this.http
      .post<WorkflowOperator[]>(
        kebabCase(nameof(this.singleListWorkflowOperator)),
        workflowOperatorFilter
      )
      .pipe(Repository.responseMapToList<WorkflowOperator>(WorkflowOperator));
  };
  public filterListWorkflowOperator = (
    workflowOperatorFilter: WorkflowOperatorFilter
  ): Observable<WorkflowOperator[]> => {
    return this.http
      .post<WorkflowOperator[]>(
        kebabCase(nameof(this.filterListWorkflowOperator)),
        workflowOperatorFilter
      )
      .pipe(Repository.responseMapToList<WorkflowOperator>(WorkflowOperator));
  };
  public singleListWorkflowParameter = (
    workflowParameterFilter: WorkflowParameterFilter
  ): Observable<WorkflowParameter[]> => {
    return this.http
      .post<WorkflowParameter[]>(
        kebabCase(nameof(this.singleListWorkflowParameter)),
        workflowParameterFilter
      )
      .pipe(Repository.responseMapToList<WorkflowParameter>(WorkflowParameter));
  };
  public filterListWorkflowParameter = (
    workflowParameterFilter: WorkflowParameterFilter
  ): Observable<WorkflowParameter[]> => {
    return this.http
      .post<WorkflowParameter[]>(
        kebabCase(nameof(this.filterListWorkflowParameter)),
        workflowParameterFilter
      )
      .pipe(Repository.responseMapToList<WorkflowParameter>(WorkflowParameter));
  };
  public singleListMasterData = (masterDataFilter: MasterDataFilter): Observable<MasterData[]> => {
    return this.http
      .post<MasterData[]>(kebabCase(nameof(this.singleListMasterData)), masterDataFilter)
      .pipe(Repository.responseMapToList<MasterData>(MasterData));
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

export const workflowDirectionRepository = new WorkflowDirectionRepository();
