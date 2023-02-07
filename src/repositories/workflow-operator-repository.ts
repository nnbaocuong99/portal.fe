import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_WORKFLOW_OPERATOR_PREFIX } from "config/api-consts";
import { WorkflowOperator, WorkflowOperatorFilter } from 'models/WorkflowOperator';
import { WorkflowParameterType, WorkflowParameterTypeFilter } from 'models/WorkflowParameterType';

export type KeyType = string | number;

export class WorkflowOperatorRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_WORKFLOW_OPERATOR_PREFIX, BASE_API_URL).href;      
    }

    public count = (workflowOperatorFilter?: WorkflowOperatorFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), workflowOperatorFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (workflowOperatorFilter?: WorkflowOperatorFilter): Observable<WorkflowOperator[]> => {
        return this.http.post<WorkflowOperator[]>(kebabCase(nameof(this.list)), workflowOperatorFilter)
            .pipe(Repository.responseMapToList<WorkflowOperator>(WorkflowOperator));
    };

    public get = (id: number | string): Observable<WorkflowOperator> => {
        return this.http.post<WorkflowOperator>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<WorkflowOperator>(WorkflowOperator));
    };

    public create = (workflowOperator: WorkflowOperator): Observable<WorkflowOperator> => {
        return this.http.post<WorkflowOperator>(kebabCase(nameof(this.create)), workflowOperator)
            .pipe(Repository.responseMapToModel<WorkflowOperator>(WorkflowOperator));
    };

    public update = (workflowOperator: WorkflowOperator): Observable<WorkflowOperator> => {
        return this.http.post<WorkflowOperator>(kebabCase(nameof(this.update)), workflowOperator)
            .pipe(Repository.responseMapToModel<WorkflowOperator>(WorkflowOperator));
    };

    public delete = (workflowOperator: WorkflowOperator): Observable<WorkflowOperator> => {
        return this.http.post<WorkflowOperator>(kebabCase(nameof(this.delete)), workflowOperator)
            .pipe(Repository.responseMapToModel<WorkflowOperator>(WorkflowOperator));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (workflowOperator: WorkflowOperator): Observable<WorkflowOperator> => {
        return workflowOperator.id ? this.update(workflowOperator) : this.create(workflowOperator);
    };

    public singleListWorkflowParameterType = (workflowParameterTypeFilter: WorkflowParameterTypeFilter): Observable<WorkflowParameterType[]> => {
        return this.http.post<WorkflowParameterType[]>(kebabCase(nameof(this.singleListWorkflowParameterType)), workflowParameterTypeFilter)
            .pipe(Repository.responseMapToList<WorkflowParameterType>(WorkflowParameterType));
    }
    public filterListWorkflowParameterType = (workflowParameterTypeFilter: WorkflowParameterTypeFilter): Observable<WorkflowParameterType[]> => {
        return this.http.post<WorkflowParameterType[]>(kebabCase(nameof(this.filterListWorkflowParameterType)), workflowParameterTypeFilter)
            .pipe(Repository.responseMapToList<WorkflowParameterType>(WorkflowParameterType));
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

export const workflowOperatorRepository = new WorkflowOperatorRepository();
