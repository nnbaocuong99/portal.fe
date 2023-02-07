import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_WARD_PREFIX } from "config/api-consts";
import { Ward, WardFilter } from 'models/Ward';
import { District, DistrictFilter } from 'models/District';
import { Status, StatusFilter } from 'models/Status';
import { Province, ProvinceFilter } from "models/Province";

export type KeyType = string | number;

export class WardRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_WARD_PREFIX, BASE_API_URL).href;      
    }

    public count = (wardFilter?: WardFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), wardFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (wardFilter?: WardFilter): Observable<Ward[]> => {
        return this.http.post<Ward[]>(kebabCase(nameof(this.list)), wardFilter)
            .pipe(Repository.responseMapToList<Ward>(Ward));
    };

    public get = (id: number | string): Observable<Ward> => {
        return this.http.post<Ward>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<Ward>(Ward));
    };

    public create = (ward: Ward): Observable<Ward> => {
        return this.http.post<Ward>(kebabCase(nameof(this.create)), ward)
            .pipe(Repository.responseMapToModel<Ward>(Ward));
    };

    public update = (ward: Ward): Observable<Ward> => {
        return this.http.post<Ward>(kebabCase(nameof(this.update)), ward)
            .pipe(Repository.responseMapToModel<Ward>(Ward));
    };

    public delete = (ward: Ward): Observable<Ward> => {
        return this.http.post<Ward>(kebabCase(nameof(this.delete)), ward)
            .pipe(Repository.responseMapToModel<Ward>(Ward));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (ward: Ward): Observable<Ward> => {
        return ward.id ? this.update(ward) : this.create(ward);
    };

    public singleListDistrict = (districtFilter: DistrictFilter): Observable<District[]> => {
        return this.http.post<District[]>(kebabCase(nameof(this.singleListDistrict)), districtFilter)
            .pipe(Repository.responseMapToList<District>(District));
    }
    public filterListDistrict = (districtFilter: DistrictFilter): Observable<District[]> => {
        return this.http.post<District[]>(kebabCase(nameof(this.filterListDistrict)), districtFilter)
            .pipe(Repository.responseMapToList<District>(District));
    };
    public singleListProvince = (provinceFilter: ProvinceFilter): Observable<Province[]> => {
        return this.http.post<Province[]>(kebabCase(nameof(this.singleListProvince)), provinceFilter)
            .pipe(Repository.responseMapToList<Province>(Province));
    }
    public filterListProvince = (provinceFilter: ProvinceFilter): Observable<Province[]> => {
        return this.http.post<Province[]>(kebabCase(nameof(this.filterListProvince)), provinceFilter)
            .pipe(Repository.responseMapToList<Province>(Province));
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

export const wardRepository = new WardRepository();
