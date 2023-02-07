import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_THEME_PREFIX } from "config/api-consts";
import { Theme, ThemeFilter } from 'models/Theme';

export type KeyType = string | number;

export class ThemeRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_THEME_PREFIX, BASE_API_URL).href;      
    }

    public count = (themeFilter?: ThemeFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), themeFilter)
          .pipe(Repository.responseDataMapper<number>());
    };

    public list = (themeFilter?: ThemeFilter): Observable<Theme[]> => {
        return this.http.post<Theme[]>(kebabCase(nameof(this.list)), themeFilter)
            .pipe(Repository.responseMapToList<Theme>(Theme));
    };

    public get = (id: number | string): Observable<Theme> => {
        return this.http.post<Theme>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<Theme>(Theme));
    };

    public create = (theme: Theme): Observable<Theme> => {
        return this.http.post<Theme>(kebabCase(nameof(this.create)), theme)
            .pipe(Repository.responseMapToModel<Theme>(Theme));
    };

    public update = (theme: Theme): Observable<Theme> => {
        return this.http.post<Theme>(kebabCase(nameof(this.update)), theme)
            .pipe(Repository.responseMapToModel<Theme>(Theme));
    };

    public delete = (theme: Theme): Observable<Theme> => {
        return this.http.post<Theme>(kebabCase(nameof(this.delete)), theme)
            .pipe(Repository.responseMapToModel<Theme>(Theme));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (theme: Theme): Observable<Theme> => {
        return theme.id ? this.update(theme) : this.create(theme);
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

export const themeRepository = new ThemeRepository();
