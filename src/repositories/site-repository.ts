import { SiteTypeFilter } from "./../models/SiteType/SiteTypeFilter";
import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from "config/http";
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_SITE_PREFIX } from "config/api-consts";
import { Site, SiteFilter } from "models/Site";
import { SiteType } from "models/SiteType";

export type KeyType = string | number;

export class SiteRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_SITE_PREFIX, BASE_API_URL).href;
  }

  public count = (siteFilter?: SiteFilter): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), siteFilter)
      .pipe(Repository.responseDataMapper<number>());
  };

  public list = (siteFilter?: SiteFilter): Observable<Site[]> => {
    return this.http
      .post<Site[]>(kebabCase(nameof(this.list)), siteFilter)
      .pipe(Repository.responseMapToList<Site>(Site));
  };

  public get = (id: number | string): Observable<Site> => {
    return this.http
      .post<Site>(kebabCase(nameof(this.get)), { id })
      .pipe(Repository.responseMapToModel<Site>(Site));
  };

  public create = (site: Site): Observable<Site> => {
    return this.http
      .post<Site>(kebabCase(nameof(this.create)), site)
      .pipe(Repository.responseMapToModel<Site>(Site));
  };

  public update = (site: Site): Observable<Site> => {
    return this.http
      .post<Site>(kebabCase(nameof(this.update)), site)
      .pipe(Repository.responseMapToModel<Site>(Site));
  };

  public delete = (site: Site): Observable<Site> => {
    return this.http
      .post<Site>(kebabCase(nameof(this.delete)), site)
      .pipe(Repository.responseMapToModel<Site>(Site));
  };

  public bulkDelete = (idList: KeyType[]): Observable<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .pipe(Repository.responseDataMapper());
  };

  public save = (site: Site): Observable<Site> => {
    return site.id ? this.update(site) : this.create(site);
  };

  public import = (
    file: File,
    name: string = nameof(file)
  ): Observable<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file as Blob);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData)
      .pipe(Repository.responseDataMapper<any>());
  };

  public export = (filter: any): Observable<AxiosResponse<any>> => {
    return this.http.post("export", filter, {
      responseType: "arraybuffer",
    });
  };

  public exportTemplate = (): Observable<AxiosResponse<any>> => {
    return this.http.post(
      "export-template",
      {},
      {
        responseType: "arraybuffer",
      }
    );
  };

  public saveImage = (
    file: any,
    params?: { [key: string]: any }
  ): Observable<any> => {
    const formData: FormData = new FormData();
    formData.append("file", file);
    return this.http
      .post<void>(kebabCase(nameof(this.saveImage)), formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params,
      })
      .pipe(Repository.responseDataMapper<any>());
  };
  public singleListSiteType = (
    siteTypeFilter?: SiteTypeFilter
  ): Observable<SiteType[]> => {
    return this.http
      .post<SiteType[]>(
        kebabCase(nameof(this.singleListSiteType)),
        siteTypeFilter ? siteTypeFilter : new SiteTypeFilter()
      )
      .pipe(Repository.responseMapToList<SiteType>(SiteType));
  };
}

export const siteRepository = new SiteRepository();
