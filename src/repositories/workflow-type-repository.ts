import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_WORKFLOW_TYPE_PREFIX } from "config/api-consts";
import { WorkflowType, WorkflowTypeFilter } from 'models/WorkflowType';
import { Site, SiteFilter } from 'models/Site';

export type KeyType = string | number;

export class WorkflowTypeRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_WORKFLOW_TYPE_PREFIX, BASE_API_URL).href;      
    }

    public count = (workflowTypeFilter?: WorkflowTypeFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), workflowTypeFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (workflowTypeFilter?: WorkflowTypeFilter): Observable<WorkflowType[]> => {
        return this.http.post<WorkflowType[]>(kebabCase(nameof(this.list)), workflowTypeFilter)
            .pipe(Repository.responseMapToList<WorkflowType>(WorkflowType));
    };

    public get = (id: number | string): Observable<WorkflowType> => {
        return this.http.post<WorkflowType>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<WorkflowType>(WorkflowType));
    };

    public create = (workflowType: WorkflowType): Observable<WorkflowType> => {
        return this.http.post<WorkflowType>(kebabCase(nameof(this.create)), workflowType)
            .pipe(Repository.responseMapToModel<WorkflowType>(WorkflowType));
    };

    public update = (workflowType: WorkflowType): Observable<WorkflowType> => {
        return this.http.post<WorkflowType>(kebabCase(nameof(this.update)), workflowType)
            .pipe(Repository.responseMapToModel<WorkflowType>(WorkflowType));
    };

    public delete = (workflowType: WorkflowType): Observable<WorkflowType> => {
        return this.http.post<WorkflowType>(kebabCase(nameof(this.delete)), workflowType)
            .pipe(Repository.responseMapToModel<WorkflowType>(WorkflowType));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (workflowType: WorkflowType): Observable<WorkflowType> => {
        return workflowType.id ? this.update(workflowType) : this.create(workflowType);
    };

    public singleListSite = (siteFilter: SiteFilter): Observable<Site[]> => {
        return this.http.post<Site[]>(kebabCase(nameof(this.singleListSite)), siteFilter)
            .pipe(Repository.responseMapToList<Site>(Site));
    }
    public filterListSite = (siteFilter: SiteFilter): Observable<Site[]> => {
        return this.http.post<Site[]>(kebabCase(nameof(this.filterListSite)), siteFilter)
            .pipe(Repository.responseMapToList<Site>(Site));
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

export const workflowTypeRepository = new WorkflowTypeRepository();
