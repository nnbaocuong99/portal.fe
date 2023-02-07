import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_PROVIDER_PREFIX } from "config/api-consts";
import { Provider, ProviderFilter } from 'models/Provider';

export type KeyType = string | number;

export class ProviderRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_PROVIDER_PREFIX, BASE_API_URL).href;      
    }

    public count = (providerFilter?: ProviderFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), providerFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (providerFilter?: ProviderFilter): Observable<Provider[]> => {
        return this.http.post<Provider[]>(kebabCase(nameof(this.list)), providerFilter)
            .pipe(Repository.responseMapToList<Provider>(Provider));
    };

    public get = (id: number | string): Observable<Provider> => {
        return this.http.post<Provider>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<Provider>(Provider));
    };

    public create = (provider: Provider): Observable<Provider> => {
        return this.http.post<Provider>(kebabCase(nameof(this.create)), provider)
            .pipe(Repository.responseMapToModel<Provider>(Provider));
    };

    public update = (provider: Provider): Observable<Provider> => {
        return this.http.post<Provider>(kebabCase(nameof(this.update)), provider)
            .pipe(Repository.responseMapToModel<Provider>(Provider));
    };

    public delete = (provider: Provider): Observable<Provider> => {
        return this.http.post<Provider>(kebabCase(nameof(this.delete)), provider)
            .pipe(Repository.responseMapToModel<Provider>(Provider));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (provider: Provider): Observable<Provider> => {
        return provider.id ? this.update(provider) : this.create(provider);
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

export const providerRepository = new ProviderRepository();
