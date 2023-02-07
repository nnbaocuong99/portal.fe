import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_APP_USER_PERMISSION_PREFIX } from "config/api-consts";
import { AppUserPermission, AppUserPermissionFilter } from 'models/AppUserPermission';

export type KeyType = string | number;

export class AppUserPermissionRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_APP_USER_PERMISSION_PREFIX, BASE_API_URL).href;      
    }

    public count = (appUserPermissionFilter?: AppUserPermissionFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), appUserPermissionFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (appUserPermissionFilter?: AppUserPermissionFilter): Observable<AppUserPermission[]> => {
        return this.http.post<AppUserPermission[]>(kebabCase(nameof(this.list)), appUserPermissionFilter)
            .pipe(Repository.responseMapToList<AppUserPermission>(AppUserPermission));
    };

    public get = (id: number | string): Observable<AppUserPermission> => {
        return this.http.post<AppUserPermission>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<AppUserPermission>(AppUserPermission));
    };

    public create = (appUserPermission: AppUserPermission): Observable<AppUserPermission> => {
        return this.http.post<AppUserPermission>(kebabCase(nameof(this.create)), appUserPermission)
            .pipe(Repository.responseMapToModel<AppUserPermission>(AppUserPermission));
    };

    public update = (appUserPermission: AppUserPermission): Observable<AppUserPermission> => {
        return this.http.post<AppUserPermission>(kebabCase(nameof(this.update)), appUserPermission)
            .pipe(Repository.responseMapToModel<AppUserPermission>(AppUserPermission));
    };

    public delete = (appUserPermission: AppUserPermission): Observable<AppUserPermission> => {
        return this.http.post<AppUserPermission>(kebabCase(nameof(this.delete)), appUserPermission)
            .pipe(Repository.responseMapToModel<AppUserPermission>(AppUserPermission));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (appUserPermission: AppUserPermission): Observable<AppUserPermission> => {
        return appUserPermission.id ? this.update(appUserPermission) : this.create(appUserPermission);
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

export const appUserPermissionRepository = new AppUserPermissionRepository();
