import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_WORKFLOW_DIRECTION_CONDITION_PREFIX } from "config/api-consts";
import { WorkflowDirectionCondition, WorkflowDirectionConditionFilter } from 'models/WorkflowDirectionCondition';
import { WorkflowDirection, WorkflowDirectionFilter } from 'models/WorkflowDirection';
import { WorkflowOperator, WorkflowOperatorFilter } from 'models/WorkflowOperator';
import { WorkflowParameter, WorkflowParameterFilter } from 'models/WorkflowParameter';

export type KeyType = string | number;

export class WorkflowDirectionConditionRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_WORKFLOW_DIRECTION_CONDITION_PREFIX, BASE_API_URL).href;      
    }

    public count = (workflowDirectionConditionFilter?: WorkflowDirectionConditionFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), workflowDirectionConditionFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (workflowDirectionConditionFilter?: WorkflowDirectionConditionFilter): Observable<WorkflowDirectionCondition[]> => {
        return this.http.post<WorkflowDirectionCondition[]>(kebabCase(nameof(this.list)), workflowDirectionConditionFilter)
            .pipe(Repository.responseMapToList<WorkflowDirectionCondition>(WorkflowDirectionCondition));
    };

    public get = (id: number | string): Observable<WorkflowDirectionCondition> => {
        return this.http.post<WorkflowDirectionCondition>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<WorkflowDirectionCondition>(WorkflowDirectionCondition));
    };

    public create = (workflowDirectionCondition: WorkflowDirectionCondition): Observable<WorkflowDirectionCondition> => {
        return this.http.post<WorkflowDirectionCondition>(kebabCase(nameof(this.create)), workflowDirectionCondition)
            .pipe(Repository.responseMapToModel<WorkflowDirectionCondition>(WorkflowDirectionCondition));
    };

    public update = (workflowDirectionCondition: WorkflowDirectionCondition): Observable<WorkflowDirectionCondition> => {
        return this.http.post<WorkflowDirectionCondition>(kebabCase(nameof(this.update)), workflowDirectionCondition)
            .pipe(Repository.responseMapToModel<WorkflowDirectionCondition>(WorkflowDirectionCondition));
    };

    public delete = (workflowDirectionCondition: WorkflowDirectionCondition): Observable<WorkflowDirectionCondition> => {
        return this.http.post<WorkflowDirectionCondition>(kebabCase(nameof(this.delete)), workflowDirectionCondition)
            .pipe(Repository.responseMapToModel<WorkflowDirectionCondition>(WorkflowDirectionCondition));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (workflowDirectionCondition: WorkflowDirectionCondition): Observable<WorkflowDirectionCondition> => {
        return workflowDirectionCondition.id ? this.update(workflowDirectionCondition) : this.create(workflowDirectionCondition);
    };

    public singleListWorkflowDirection = (workflowDirectionFilter: WorkflowDirectionFilter): Observable<WorkflowDirection[]> => {
        return this.http.post<WorkflowDirection[]>(kebabCase(nameof(this.singleListWorkflowDirection)), workflowDirectionFilter)
            .pipe(Repository.responseMapToList<WorkflowDirection>(WorkflowDirection));
    }
    public filterListWorkflowDirection = (workflowDirectionFilter: WorkflowDirectionFilter): Observable<WorkflowDirection[]> => {
        return this.http.post<WorkflowDirection[]>(kebabCase(nameof(this.filterListWorkflowDirection)), workflowDirectionFilter)
            .pipe(Repository.responseMapToList<WorkflowDirection>(WorkflowDirection));
    };
    public singleListWorkflowOperator = (workflowOperatorFilter: WorkflowOperatorFilter): Observable<WorkflowOperator[]> => {
        return this.http.post<WorkflowOperator[]>(kebabCase(nameof(this.singleListWorkflowOperator)), workflowOperatorFilter)
            .pipe(Repository.responseMapToList<WorkflowOperator>(WorkflowOperator));
    }
    public filterListWorkflowOperator = (workflowOperatorFilter: WorkflowOperatorFilter): Observable<WorkflowOperator[]> => {
        return this.http.post<WorkflowOperator[]>(kebabCase(nameof(this.filterListWorkflowOperator)), workflowOperatorFilter)
            .pipe(Repository.responseMapToList<WorkflowOperator>(WorkflowOperator));
    };
    public singleListWorkflowParameter = (workflowParameterFilter: WorkflowParameterFilter): Observable<WorkflowParameter[]> => {
        return this.http.post<WorkflowParameter[]>(kebabCase(nameof(this.singleListWorkflowParameter)), workflowParameterFilter)
            .pipe(Repository.responseMapToList<WorkflowParameter>(WorkflowParameter));
    }
    public filterListWorkflowParameter = (workflowParameterFilter: WorkflowParameterFilter): Observable<WorkflowParameter[]> => {
        return this.http.post<WorkflowParameter[]>(kebabCase(nameof(this.filterListWorkflowParameter)), workflowParameterFilter)
            .pipe(Repository.responseMapToList<WorkflowParameter>(WorkflowParameter));
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

export const workflowDirectionConditionRepository = new WorkflowDirectionConditionRepository();
