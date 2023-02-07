import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_APP_USER_SESSION_PREFIX } from "config/api-consts";
import { AppUserSession, AppUserSessionFilter } from 'models/AppUserSession';
import { AppUser, AppUserFilter } from 'models/AppUser';
import { Status, StatusFilter } from 'models/Status';

export type KeyType = string | number;

export class AppUserSessionRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_APP_USER_SESSION_PREFIX, BASE_API_URL).href;      
    }

    public count = (appUserSessionFilter?: AppUserSessionFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), appUserSessionFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (appUserSessionFilter?: AppUserSessionFilter): Observable<AppUserSession[]> => {
        return this.http.post<AppUserSession[]>(kebabCase(nameof(this.list)), appUserSessionFilter)
            .pipe(Repository.responseMapToList<AppUserSession>(AppUserSession));
    };

    public get = (id: number | string): Observable<AppUserSession> => {
        return this.http.post<AppUserSession>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<AppUserSession>(AppUserSession));
    };

    public create = (appUserSession: AppUserSession): Observable<AppUserSession> => {
        return this.http.post<AppUserSession>(kebabCase(nameof(this.create)), appUserSession)
            .pipe(Repository.responseMapToModel<AppUserSession>(AppUserSession));
    };

    public update = (appUserSession: AppUserSession): Observable<AppUserSession> => {
        return this.http.post<AppUserSession>(kebabCase(nameof(this.update)), appUserSession)
            .pipe(Repository.responseMapToModel<AppUserSession>(AppUserSession));
    };

    public delete = (appUserSession: AppUserSession): Observable<AppUserSession> => {
        return this.http.post<AppUserSession>(kebabCase(nameof(this.delete)), appUserSession)
            .pipe(Repository.responseMapToModel<AppUserSession>(AppUserSession));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (appUserSession: AppUserSession): Observable<AppUserSession> => {
        return appUserSession.id ? this.update(appUserSession) : this.create(appUserSession);
    };

    public singleListAppUser = (appUserFilter: AppUserFilter): Observable<AppUser[]> => {
        return this.http.post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), appUserFilter)
            .pipe(Repository.responseMapToList<AppUser>(AppUser));
    }
    public filterListAppUser = (appUserFilter: AppUserFilter): Observable<AppUser[]> => {
        return this.http.post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), appUserFilter)
            .pipe(Repository.responseMapToList<AppUser>(AppUser));
    };
    public singleListStatus = (): Observable<Status[]> => {
        return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
            .pipe(Repository.responseMapToList<Status>(Status));
    };

    public filterListStatus = (statusFilter: StatusFilter): Observable<Status[]> => {
        return this.http.post<Status[]>(kebabCase(nameof(this.filterListStatus)), statusFilter)
            .pipe(Repository.responseMapToList<Status>(Status));
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

export const appUserSessionRepository = new AppUserSessionRepository();
