import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_WORKFLOW_PARAMETER_PREFIX } from "config/api-consts";
import { WorkflowParameter, WorkflowParameterFilter } from 'models/WorkflowParameter';
import { WorkflowParameterType, WorkflowParameterTypeFilter } from 'models/WorkflowParameterType';
import { WorkflowType, WorkflowTypeFilter } from 'models/WorkflowType';

export type KeyType = string | number;

export class WorkflowParameterRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_WORKFLOW_PARAMETER_PREFIX, BASE_API_URL).href;      
    }

    public count = (workflowParameterFilter?: WorkflowParameterFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), workflowParameterFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (workflowParameterFilter?: WorkflowParameterFilter): Observable<WorkflowParameter[]> => {
        return this.http.post<WorkflowParameter[]>(kebabCase(nameof(this.list)), workflowParameterFilter)
            .pipe(Repository.responseMapToList<WorkflowParameter>(WorkflowParameter));
    };

    public get = (id: number | string): Observable<WorkflowParameter> => {
        return this.http.post<WorkflowParameter>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<WorkflowParameter>(WorkflowParameter));
    };

    public create = (workflowParameter: WorkflowParameter): Observable<WorkflowParameter> => {
        return this.http.post<WorkflowParameter>(kebabCase(nameof(this.create)), workflowParameter)
            .pipe(Repository.responseMapToModel<WorkflowParameter>(WorkflowParameter));
    };

    public update = (workflowParameter: WorkflowParameter): Observable<WorkflowParameter> => {
        return this.http.post<WorkflowParameter>(kebabCase(nameof(this.update)), workflowParameter)
            .pipe(Repository.responseMapToModel<WorkflowParameter>(WorkflowParameter));
    };

    public delete = (workflowParameter: WorkflowParameter): Observable<WorkflowParameter> => {
        return this.http.post<WorkflowParameter>(kebabCase(nameof(this.delete)), workflowParameter)
            .pipe(Repository.responseMapToModel<WorkflowParameter>(WorkflowParameter));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (workflowParameter: WorkflowParameter): Observable<WorkflowParameter> => {
        return workflowParameter.id ? this.update(workflowParameter) : this.create(workflowParameter);
    };

    public singleListWorkflowParameterType = (workflowParameterTypeFilter: WorkflowParameterTypeFilter): Observable<WorkflowParameterType[]> => {
        return this.http.post<WorkflowParameterType[]>(kebabCase(nameof(this.singleListWorkflowParameterType)), workflowParameterTypeFilter)
            .pipe(Repository.responseMapToList<WorkflowParameterType>(WorkflowParameterType));
    }
    public filterListWorkflowParameterType = (workflowParameterTypeFilter: WorkflowParameterTypeFilter): Observable<WorkflowParameterType[]> => {
        return this.http.post<WorkflowParameterType[]>(kebabCase(nameof(this.filterListWorkflowParameterType)), workflowParameterTypeFilter)
            .pipe(Repository.responseMapToList<WorkflowParameterType>(WorkflowParameterType));
    };
    public singleListWorkflowType = (workflowTypeFilter: WorkflowTypeFilter): Observable<WorkflowType[]> => {
        return this.http.post<WorkflowType[]>(kebabCase(nameof(this.singleListWorkflowType)), workflowTypeFilter)
            .pipe(Repository.responseMapToList<WorkflowType>(WorkflowType));
    }
    public filterListWorkflowType = (workflowTypeFilter: WorkflowTypeFilter): Observable<WorkflowType[]> => {
        return this.http.post<WorkflowType[]>(kebabCase(nameof(this.filterListWorkflowType)), workflowTypeFilter)
            .pipe(Repository.responseMapToList<WorkflowType>(WorkflowType));
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

export const workflowParameterRepository = new WorkflowParameterRepository();
