import { BehaviorSubject, Observable } from "rxjs";
import * as Cookie from "js-cookie";
import { LOGIN_ROUTE } from "config/route-consts";
import { Repository } from "react3l-common";
import { httpConfig } from "config/http";
import { AppUser } from "models/AppUser";

class AuthenticationService extends Repository {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  constructor() {
    super(httpConfig);

    const currentUserInfo = localStorage.getItem("currentUserInfo");
    this.currentUserSubject = new BehaviorSubject<any>(
      currentUserInfo ? JSON.parse(currentUserInfo) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
    if (this.currentUserSubject.value && this.currentUserSubject.value.token) {
      Cookie.set("Token", this.currentUserSubject.value.token);
    }
  }

  public checkAuth() {
    return this.http
      .post("rpc/portal/profile-web/get")
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  }
  public login(appUser: AppUser) {
    return this.http
      .post("rpc/portal/account/login", appUser)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  }

  public logout() {
    localStorage.removeItem("currentUserInfo");
    Cookie.remove("Token");
    Cookie.remove("RefreshToken");
    // this.currentUserSubject.next(null);
    window.location.href = LOGIN_ROUTE;
  }

  public recoveryPassword = (password: string): Observable<AppUser> => {
    return this.http
      .post("rpc/portal/profile/recovery-password", { password })
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };

  public verifyOtpCode = (appUser: AppUser): Observable<AppUser> => {
    return this.http
      .post("rpc/portal/profile/verify-otp-code", appUser)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };

  public forgotPassword = (email: string): Observable<AppUser> => {
    return this.http
      .post("rpc/portal/profile/forgot-password", { email })
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };

  public loginByGmail = (idToken: number) => {
    return this.http
      .post("rpc/portal/account/login-by-gmail", { idToken })
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
}

export default new AuthenticationService();
