import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_DISTRICT_PREFIX } from "config/api-consts";
import { District, DistrictFilter } from 'models/District';
import { Province, ProvinceFilter } from 'models/Province';
import { Status, StatusFilter } from 'models/Status';

export type KeyType = string | number;

export class DistrictRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_DISTRICT_PREFIX, BASE_API_URL).href;      
    }

    public count = (districtFilter?: DistrictFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), districtFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (districtFilter?: DistrictFilter): Observable<District[]> => {
        return this.http.post<District[]>(kebabCase(nameof(this.list)), districtFilter)
            .pipe(Repository.responseMapToList<District>(District));
    };

    public get = (id: number | string): Observable<District> => {
        return this.http.post<District>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<District>(District));
    };

    public create = (district: District): Observable<District> => {
        return this.http.post<District>(kebabCase(nameof(this.create)), district)
            .pipe(Repository.responseMapToModel<District>(District));
    };

    public update = (district: District): Observable<District> => {
        return this.http.post<District>(kebabCase(nameof(this.update)), district)
            .pipe(Repository.responseMapToModel<District>(District));
    };

    public delete = (district: District): Observable<District> => {
        return this.http.post<District>(kebabCase(nameof(this.delete)), district)
            .pipe(Repository.responseMapToModel<District>(District));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (district: District): Observable<District> => {
        return district.id ? this.update(district) : this.create(district);
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

export const districtRepository = new DistrictRepository();
