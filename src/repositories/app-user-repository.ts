import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_APP_USER_PREFIX } from "config/api-consts";
import { AppUser, AppUserFilter } from 'models/AppUser';
import { Organization, OrganizationFilter } from 'models/Organization';
import { Sex, SexFilter } from 'models/Sex';
import { Status, StatusFilter } from 'models/Status';
import { AppUserRoleMapping, AppUserRoleMappingFilter } from 'models/AppUserRoleMapping';
import { Role, RoleFilter } from 'models/Role';
import { Site, SiteFilter } from "models/Site";

export type KeyType = string | number;

export class AppUserRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_APP_USER_PREFIX, BASE_API_URL).href;
    }

    public count = (appUserFilter?: AppUserFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), appUserFilter)
            .pipe(Repository.responseDataMapper<number>());
    };

    public list = (appUserFilter?: AppUserFilter): Observable<AppUser[]> => {
        return this.http.post<AppUser[]>(kebabCase(nameof(this.list)), appUserFilter)
            .pipe(Repository.responseMapToList<AppUser>(AppUser));
    };

    public get = (id: number | string): Observable<AppUser> => {
        return this.http.post<AppUser>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<AppUser>(AppUser));
    };

    public create = (appUser: AppUser): Observable<AppUser> => {
        return this.http.post<AppUser>(kebabCase(nameof(this.create)), appUser)
            .pipe(Repository.responseMapToModel<AppUser>(AppUser));
    };

    public update = (appUser: AppUser): Observable<AppUser> => {
        return this.http.post<AppUser>(kebabCase(nameof(this.update)), appUser)
            .pipe(Repository.responseMapToModel<AppUser>(AppUser));
    };

    public updateRole = (appUser: AppUser): Observable<AppUser> => {
        return this.http.post<AppUser>(kebabCase(nameof(this.updateRole)), appUser)
            .pipe(Repository.responseMapToModel<AppUser>(AppUser));
    };
    public delete = (appUser: AppUser): Observable<AppUser> => {
        return this.http.post<AppUser>(kebabCase(nameof(this.delete)), appUser)
            .pipe(Repository.responseMapToModel<AppUser>(AppUser));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (appUser: AppUser): Observable<AppUser> => {
        return appUser.id ? this.update(appUser) : this.create(appUser);
    };

    public singleListOrganization = (organizationFilter: OrganizationFilter): Observable<Organization[]> => {
        return this.http.post<Organization[]>(kebabCase(nameof(this.singleListOrganization)), organizationFilter)
            .pipe(Repository.responseMapToList<Organization>(Organization));
    }
    public filterListOrganization = (organizationFilter: OrganizationFilter): Observable<Organization[]> => {
        return this.http.post<Organization[]>(kebabCase(nameof(this.filterListOrganization)), organizationFilter)
            .pipe(Repository.responseMapToList<Organization>(Organization));
    };
    public singleListSex = (): Observable<Sex[]> => {
        return this.http.post<Sex[]>(kebabCase(nameof(this.singleListSex)), new SexFilter())
            .pipe(Repository.responseMapToList<Sex>(Sex));
    };

    public filterListSex = (sexFilter: SexFilter): Observable<Sex[]> => {
        return this.http.post<Sex[]>(kebabCase(nameof(this.filterListSex)), sexFilter)
            .pipe(Repository.responseMapToList<Sex>(Sex));
    };
    public singleListStatus = (): Observable<Status[]> => {
        return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
            .pipe(Repository.responseMapToList<Status>(Status));
    };

    public filterListStatus = (statusFilter: StatusFilter): Observable<Status[]> => {
        return this.http.post<Status[]>(kebabCase(nameof(this.filterListStatus)), statusFilter)
            .pipe(Repository.responseMapToList<Status>(Status));
    };
    public singleListAppUserRoleMapping = (appUserRoleMappingFilter: AppUserRoleMappingFilter): Observable<AppUserRoleMapping[]> => {
        return this.http.post<AppUserRoleMapping[]>(kebabCase(nameof(this.singleListAppUserRoleMapping)), appUserRoleMappingFilter)
            .pipe(Repository.responseMapToList<AppUserRoleMapping>(AppUserRoleMapping));
    }
    public filterListAppUserRoleMapping = (appUserRoleMappingFilter: AppUserRoleMappingFilter): Observable<AppUserRoleMapping[]> => {
        return this.http.post<AppUserRoleMapping[]>(kebabCase(nameof(this.filterListAppUserRoleMapping)), appUserRoleMappingFilter)
            .pipe(Repository.responseMapToList<AppUserRoleMapping>(AppUserRoleMapping));
    };
    public singleListRole = (roleFilter: RoleFilter): Observable<Role[]> => {
        return this.http.post<Role[]>(kebabCase(nameof(this.singleListRole)), roleFilter)
            .pipe(Repository.responseMapToList<Role>(Role));
    }
    public filterListRole = (roleFilter: RoleFilter): Observable<Role[]> => {
        return this.http.post<Role[]>(kebabCase(nameof(this.filterListRole)), roleFilter)
            .pipe(Repository.responseMapToList<Role>(Role));
    };

    public countRole = (roleFilter: RoleFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.countRole)), roleFilter)
            .pipe(Repository.responseDataMapper<number>());
    };
    public listRole = (roleFilter: RoleFilter): Observable<Role[]> => {
        return this.http.post<Role[]>(kebabCase(nameof(this.listRole)), roleFilter)
            .pipe(Repository.responseMapToList<Role>(Role));
    };

    public listSite = (siteFilter: SiteFilter): Observable<Site[]> => {
        return this.http.post<Site[]>(kebabCase(nameof(this.listSite)), siteFilter)
            .pipe(Repository.responseMapToList<Role>(Role));
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

    public changePassword = (appUser: AppUser): Observable<AppUser> => {
        return this.http.post<AppUser>(kebabCase(nameof(this.changePassword)), appUser)
            .pipe(Repository.responseMapToModel<AppUser>(AppUser));
    };

}

export const appUserRepository = new AppUserRepository();
