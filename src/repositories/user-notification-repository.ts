import { httpConfig } from "config/http";
import kebabCase from "lodash/kebabCase";
import nameof from "ts-nameof.macro";
import { BASE_API_URL } from "config/consts";
import { API_USER_NOTIFICATION_ROUTE } from "config/api-consts";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Observable } from "rxjs";
import { Repository } from "react3l-common";
import { Status, StatusFilter } from "models/Status";

export class UserNotificationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_USER_NOTIFICATION_ROUTE, BASE_API_URL).href;
  }

  public count = (usedVariationFilter?: AppUserFilter): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), usedVariationFilter)
      .pipe(Repository.responseDataMapper<number>());
  };

  public list = (
    usedVariationFilter?: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.list)), usedVariationFilter)
      .pipe(Repository.responseMapToList<AppUser>(AppUser));
  };

  public countRead = (
    usedVariationFilter?: AppUserFilter
  ): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countRead)), usedVariationFilter)
      .pipe(Repository.responseDataMapper<number>());
  };

  public listRead = (
    usedVariationFilter?: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.listRead)), usedVariationFilter)
      .pipe(Repository.responseMapToList<AppUser>(AppUser));
  };

  public countUnread = (
    usedVariationFilter?: AppUserFilter
  ): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countUnread)), usedVariationFilter)
      .pipe(Repository.responseDataMapper<number>());
  };

  public listUnread = (
    usedVariationFilter?: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.listUnread)), usedVariationFilter)
      .pipe(Repository.responseMapToList<AppUser>(AppUser));
  };

  public update = (usedVariation: AppUser): Observable<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.update)), usedVariation)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };

  public read = (id: number | string): Observable<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.read)), { id })
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };

  public unread = (id: number | string): Observable<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.unread)), { id })
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };

  public readAll = (): Observable<AppUser> => {
    return this.http
      .post<AppUser>(kebabCase(nameof(this.readAll)), {})
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };

  public filterListStatus = (): Observable<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListStatus)),
        new StatusFilter()
      )
      .pipe(Repository.responseMapToList<Status>(Status));
  };
}

export const userNotificationRepository = new UserNotificationRepository();
