import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_PERMISSION_OPERATOR_PREFIX } from "config/api-consts";
import { PermissionOperator, PermissionOperatorFilter } from 'models/PermissionOperator';
import { FieldType, FieldTypeFilter } from 'models/FieldType';

export type KeyType = string | number;

export class PermissionOperatorRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_PERMISSION_OPERATOR_PREFIX, BASE_API_URL).href;      
    }

    public count = (permissionOperatorFilter?: PermissionOperatorFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), permissionOperatorFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (permissionOperatorFilter?: PermissionOperatorFilter): Observable<PermissionOperator[]> => {
        return this.http.post<PermissionOperator[]>(kebabCase(nameof(this.list)), permissionOperatorFilter)
            .pipe(Repository.responseMapToList<PermissionOperator>(PermissionOperator));
    };

    public get = (id: number | string): Observable<PermissionOperator> => {
        return this.http.post<PermissionOperator>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<PermissionOperator>(PermissionOperator));
    };

    public create = (permissionOperator: PermissionOperator): Observable<PermissionOperator> => {
        return this.http.post<PermissionOperator>(kebabCase(nameof(this.create)), permissionOperator)
            .pipe(Repository.responseMapToModel<PermissionOperator>(PermissionOperator));
    };

    public update = (permissionOperator: PermissionOperator): Observable<PermissionOperator> => {
        return this.http.post<PermissionOperator>(kebabCase(nameof(this.update)), permissionOperator)
            .pipe(Repository.responseMapToModel<PermissionOperator>(PermissionOperator));
    };

    public delete = (permissionOperator: PermissionOperator): Observable<PermissionOperator> => {
        return this.http.post<PermissionOperator>(kebabCase(nameof(this.delete)), permissionOperator)
            .pipe(Repository.responseMapToModel<PermissionOperator>(PermissionOperator));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (permissionOperator: PermissionOperator): Observable<PermissionOperator> => {
        return permissionOperator.id ? this.update(permissionOperator) : this.create(permissionOperator);
    };

    public singleListFieldType = (fieldTypeFilter: FieldTypeFilter): Observable<FieldType[]> => {
        return this.http.post<FieldType[]>(kebabCase(nameof(this.singleListFieldType)), fieldTypeFilter)
            .pipe(Repository.responseMapToList<FieldType>(FieldType));
    }
    public filterListFieldType = (fieldTypeFilter: FieldTypeFilter): Observable<FieldType[]> => {
        return this.http.post<FieldType[]>(kebabCase(nameof(this.filterListFieldType)), fieldTypeFilter)
            .pipe(Repository.responseMapToList<FieldType>(FieldType));
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

export const permissionOperatorRepository = new PermissionOperatorRepository();
