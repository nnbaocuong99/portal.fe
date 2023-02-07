import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_NATION_PREFIX } from "config/api-consts";
import { Nation, NationFilter } from 'models/Nation';
import { Status, StatusFilter } from 'models/Status';

export type KeyType = string | number;

export class NationRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_NATION_PREFIX, BASE_API_URL).href;      
    }

    public count = (nationFilter?: NationFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), nationFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (nationFilter?: NationFilter): Observable<Nation[]> => {
        return this.http.post<Nation[]>(kebabCase(nameof(this.list)), nationFilter)
            .pipe(Repository.responseMapToList<Nation>(Nation));
    };

    public get = (id: number | string): Observable<Nation> => {
        return this.http.post<Nation>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<Nation>(Nation));
    };

    public create = (nation: Nation): Observable<Nation> => {
        return this.http.post<Nation>(kebabCase(nameof(this.create)), nation)
            .pipe(Repository.responseMapToModel<Nation>(Nation));
    };

    public update = (nation: Nation): Observable<Nation> => {
        return this.http.post<Nation>(kebabCase(nameof(this.update)), nation)
            .pipe(Repository.responseMapToModel<Nation>(Nation));
    };

    public delete = (nation: Nation): Observable<Nation> => {
        return this.http.post<Nation>(kebabCase(nameof(this.delete)), nation)
            .pipe(Repository.responseMapToModel<Nation>(Nation));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (nation: Nation): Observable<Nation> => {
        return nation.id ? this.update(nation) : this.create(nation);
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

export const nationRepository = new NationRepository();
