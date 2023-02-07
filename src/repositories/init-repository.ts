import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";
import { API_INIT_PREFIX } from "config/api-consts";
import { Init, InitFilter } from "models/Init";

export type KeyType = string | number;

export class InitRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_INIT_PREFIX, BASE_API_URL).href;
    }
    public listMasterEntity = (filter?: InitFilter): Observable<Init[]> => {
        return this.http.post<Init[]>(kebabCase(nameof(this.listMasterEntity)), filter)
            .pipe(Repository.responseMapToList<Init>(Init));
    };
    public init = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.init)), idList)
            .pipe(Repository.responseDataMapper());
    };
}

export const initRepository = new InitRepository();
