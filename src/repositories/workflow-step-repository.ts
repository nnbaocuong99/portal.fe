import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_WORKFLOW_STEP_PREFIX } from "config/api-consts";
import { WorkflowStep, WorkflowStepFilter } from 'models/WorkflowStep';
import { Role, RoleFilter } from 'models/Role';
import { Status, StatusFilter } from 'models/Status';
import { WorkflowDefinition, WorkflowDefinitionFilter } from 'models/WorkflowDefinition';

export type KeyType = string | number;

export class WorkflowStepRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_WORKFLOW_STEP_PREFIX, BASE_API_URL).href;      
    }

    public count = (workflowStepFilter?: WorkflowStepFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), workflowStepFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (workflowStepFilter?: WorkflowStepFilter): Observable<WorkflowStep[]> => {
        return this.http.post<WorkflowStep[]>(kebabCase(nameof(this.list)), workflowStepFilter)
            .pipe(Repository.responseMapToList<WorkflowStep>(WorkflowStep));
    };

    public get = (id: number | string): Observable<WorkflowStep> => {
        return this.http.post<WorkflowStep>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<WorkflowStep>(WorkflowStep));
    };

    public create = (workflowStep: WorkflowStep): Observable<WorkflowStep> => {
        return this.http.post<WorkflowStep>(kebabCase(nameof(this.create)), workflowStep)
            .pipe(Repository.responseMapToModel<WorkflowStep>(WorkflowStep));
    };

    public update = (workflowStep: WorkflowStep): Observable<WorkflowStep> => {
        return this.http.post<WorkflowStep>(kebabCase(nameof(this.update)), workflowStep)
            .pipe(Repository.responseMapToModel<WorkflowStep>(WorkflowStep));
    };

    public delete = (workflowStep: WorkflowStep): Observable<WorkflowStep> => {
        return this.http.post<WorkflowStep>(kebabCase(nameof(this.delete)), workflowStep)
            .pipe(Repository.responseMapToModel<WorkflowStep>(WorkflowStep));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (workflowStep: WorkflowStep): Observable<WorkflowStep> => {
        return workflowStep.id ? this.update(workflowStep) : this.create(workflowStep);
    };

    public singleListRole = (roleFilter: RoleFilter): Observable<Role[]> => {
        return this.http.post<Role[]>(kebabCase(nameof(this.singleListRole)), roleFilter)
            .pipe(Repository.responseMapToList<Role>(Role));
    }
    public filterListRole = (roleFilter: RoleFilter): Observable<Role[]> => {
        return this.http.post<Role[]>(kebabCase(nameof(this.filterListRole)), roleFilter)
            .pipe(Repository.responseMapToList<Role>(Role));
    };
    public singleListStatus = (): Observable<Status[]> => {
        return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
            .pipe(Repository.responseMapToList<Status>(Status));
    };

    public filterListStatus = (statusFilter: StatusFilter): Observable<Status[]> => {
        return this.http.post<Status[]>(kebabCase(nameof(this.filterListStatus)), statusFilter)
            .pipe(Repository.responseMapToList<Status>(Status));
    };
    public singleListWorkflowDefinition = (workflowDefinitionFilter: WorkflowDefinitionFilter): Observable<WorkflowDefinition[]> => {
        return this.http.post<WorkflowDefinition[]>(kebabCase(nameof(this.singleListWorkflowDefinition)), workflowDefinitionFilter)
            .pipe(Repository.responseMapToList<WorkflowDefinition>(WorkflowDefinition));
    }
    public filterListWorkflowDefinition = (workflowDefinitionFilter: WorkflowDefinitionFilter): Observable<WorkflowDefinition[]> => {
        return this.http.post<WorkflowDefinition[]>(kebabCase(nameof(this.filterListWorkflowDefinition)), workflowDefinitionFilter)
            .pipe(Repository.responseMapToList<WorkflowDefinition>(WorkflowDefinition));
    };
    
    public import = (file: File, name: string = nameof(file)): Observable<void> => {
        const formData: FormData = new FormData();
        formData.append(name, file as Blob);
        return this.http.post<void>(kebabCase(nameof(this.import)), formData)
            .pipe(Repository.responseDataMapper<any>());
    };

    public export = (filter: any): Observable<AxiosResponse<any>> => {
        return this.http.post('export', filter, {
          responseType: 'arraybuffer',
        });
    };

    public exportTemplate = (): Observable<AxiosResponse<any>> => {
        return this.http.post('export-template', {}, {
          responseType: 'arraybuffer',
        });
    };

}

export const workflowStepRepository = new WorkflowStepRepository();
