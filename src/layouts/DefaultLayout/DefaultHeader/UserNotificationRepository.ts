import { Repository } from "react3l-common";
import { httpConfig } from "config/http";

import { API_USER_NOTIFICATION_ROUTE } from "config/api-consts";
import { UserNotificationFilter } from "models/UserNotification";
import { UserNotification } from "models/UserNotification";
import kebabCase from "lodash/kebabCase";
import nameof from "ts-nameof.macro";
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";

export class UserNotificationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_USER_NOTIFICATION_ROUTE, BASE_API_URL).href;
  }

  public list = (filter?: UserNotificationFilter): any => {
    return this.http
      .post<UserNotification[]>(kebabCase(nameof(this.list)), filter)
      .pipe(Repository.responseMapToList<UserNotification>(UserNotification));
  };
  public count = (filter?: UserNotificationFilter): any => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .pipe(Repository.responseDataMapper<number>());
  };
  public countUnread = (
    filter?: UserNotificationFilter
  ): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countUnread)), filter)
      .pipe(Repository.responseDataMapper<number>());
  };
  public update = (
    userNotification: UserNotification
  ): Observable<UserNotification> => {
    return this.http
      .post<UserNotification>(kebabCase(nameof(this.update)), userNotification)
      .pipe(Repository.responseMapToModel<UserNotification>(UserNotification));
  };

  public read = (id?: number): Observable<UserNotification> => {
    return this.http
      .post<UserNotification>(kebabCase(nameof(this.read)), { id })
      .pipe(Repository.responseMapToModel<UserNotification>(UserNotification));
  };
}

const userNotificationRepository = new UserNotificationRepository();
export default userNotificationRepository;
