import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_PROVINCE_PREFIX } from "config/api-consts";
import { Province, ProvinceFilter } from 'models/Province';
import { Status, StatusFilter } from 'models/Status';

export type KeyType = string | number;

export class ProvinceRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_PROVINCE_PREFIX, BASE_API_URL).href;      
    }

    public count = (provinceFilter?: ProvinceFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), provinceFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (provinceFilter?: ProvinceFilter): Observable<Province[]> => {
        return this.http.post<Province[]>(kebabCase(nameof(this.list)), provinceFilter)
            .pipe(Repository.responseMapToList<Province>(Province));
    };

    public get = (id: number | string): Observable<Province> => {
        return this.http.post<Province>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<Province>(Province));
    };

    public create = (province: Province): Observable<Province> => {
        return this.http.post<Province>(kebabCase(nameof(this.create)), province)
            .pipe(Repository.responseMapToModel<Province>(Province));
    };

    public update = (province: Province): Observable<Province> => {
        return this.http.post<Province>(kebabCase(nameof(this.update)), province)
            .pipe(Repository.responseMapToModel<Province>(Province));
    };

    public delete = (province: Province): Observable<Province> => {
        return this.http.post<Province>(kebabCase(nameof(this.delete)), province)
            .pipe(Repository.responseMapToModel<Province>(Province));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (province: Province): Observable<Province> => {
        return province.id ? this.update(province) : this.create(province);
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

export const provinceRepository = new ProvinceRepository();
