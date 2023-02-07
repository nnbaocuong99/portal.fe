import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from "config/http";
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_ROLE_PREFIX } from "config/api-consts";
import { Role, RoleFilter } from "models/Role";
import { Status, StatusFilter } from "models/Status";
import {
  AppUserRoleMapping,
  AppUserRoleMappingFilter,
} from "models/AppUserRoleMapping";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Permission, PermissionFilter } from "models/Permission";
import { Menu, MenuFilter } from "models/Menu";
import { FieldModel, FieldModelFilter } from "models/FieldModel";
import {
  PermissionOperator,
  PermissionOperatorFilter,
} from "models/PermissionOperator";
import { Organization, OrganizationFilter } from "models/Organization";
import { Site, SiteFilter } from "models/Site";
import { MasterData, MasterDataFilter } from "models/MasterData";

export type KeyType = string | number;

export class RoleRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_ROLE_PREFIX, BASE_API_URL).href;
  }

  public count = (roleFilter?: RoleFilter): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), roleFilter)
      .pipe(Repository.responseDataMapper<number>());
  };

  public list = (roleFilter?: RoleFilter): Observable<Role[]> => {
    return this.http
      .post<Role[]>(kebabCase(nameof(this.list)), roleFilter)
      .pipe(Repository.responseMapToList<Role>(Role));
  };

  public get = (id: number | string): Observable<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.get)), { id })
      .pipe(Repository.responseMapToModel<Role>(Role));
  };

  public getMenu = (id: number | string): Observable<Menu> => {
    return this.http
      .post<Menu>(kebabCase(nameof(this.getMenu)), { id })
      .pipe(Repository.responseMapToModel<Role>(Role));
  };

  public create = (role: Role): Observable<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.create)), role)
      .pipe(Repository.responseMapToModel<Role>(Role));
  };

  // perrmision role
  public countPermission = (
    permissonFilter?: PermissionFilter
  ): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countPermission)), permissonFilter)
      .pipe(Repository.responseDataMapper<number>());
  };

  public listPermission = (
    permissonFilter?: PermissionFilter
  ): Observable<Permission[]> => {
    return this.http
      .post<Permission[]>(
        kebabCase(nameof(this.listPermission)),
        permissonFilter
      )
      .pipe(Repository.responseMapToList<Role>(Role));
  };

  public getPermission = (id: number | string): Observable<Permission> => {
    return this.http
      .post<Permission>(kebabCase(nameof(this.getPermission)), { id })
      .pipe(Repository.responseMapToModel<Role>(Role));
  };

  public createPermission = (
    permission: Permission
  ): Observable<Permission> => {
    return this.http
      .post<Permission>(kebabCase(nameof(this.createPermission)), permission)
      .pipe(Repository.responseMapToModel<Role>(Role));
  };

  public updatePermission = (
    permission: Permission
  ): Observable<Permission> => {
    return this.http
      .post<Permission>(kebabCase(nameof(this.updatePermission)), permission)
      .pipe(Repository.responseMapToModel<Role>(Role));
  };

  public deletePermission = (permision: Permission): Observable<Permission> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.deletePermission)), permision)
      .pipe(Repository.responseMapToModel<Role>(Role));
  };

  public savePermission = (permission: Permission): Observable<Permission> => {
    return permission.id
      ? this.updatePermission(permission)
      : this.createPermission(permission);
  };

  public clone = (id: number | string): Observable<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.clone)), { id })
      .pipe(Repository.responseMapToModel<Role>(Role));
  };

  public update = (role: Role): Observable<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.update)), role)
      .pipe(Repository.responseMapToModel<Role>(Role));
  };

  public delete = (role: Role): Observable<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.delete)), role)
      .pipe(Repository.responseMapToModel<Role>(Role));
  };

  public bulkDelete = (idList: KeyType[]): Observable<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .pipe(Repository.responseDataMapper());
  };

  public save = (role: Role): Observable<Role> => {
    return role.id ? this.update(role) : this.create(role);
  };

  public singleListStatus = (): Observable<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListStatus)),
        new StatusFilter()
      )
      .pipe(Repository.responseMapToList<Status>(Status));
  };

  public filterListStatus = (
    statusFilter: StatusFilter
  ): Observable<Status[]> => {
    return this.http
      .post<Status[]>(kebabCase(nameof(this.filterListStatus)), statusFilter)
      .pipe(Repository.responseMapToList<Status>(Status));
  };
  public singleListAppUserRoleMapping = (
    appUserRoleMappingFilter: AppUserRoleMappingFilter
  ): Observable<AppUserRoleMapping[]> => {
    return this.http
      .post<AppUserRoleMapping[]>(
        kebabCase(nameof(this.singleListAppUserRoleMapping)),
        appUserRoleMappingFilter
      )
      .pipe(
        Repository.responseMapToList<AppUserRoleMapping>(AppUserRoleMapping)
      );
  };
  public filterListAppUserRoleMapping = (
    appUserRoleMappingFilter: AppUserRoleMappingFilter
  ): Observable<AppUserRoleMapping[]> => {
    return this.http
      .post<AppUserRoleMapping[]>(
        kebabCase(nameof(this.filterListAppUserRoleMapping)),
        appUserRoleMappingFilter
      )
      .pipe(
        Repository.responseMapToList<AppUserRoleMapping>(AppUserRoleMapping)
      );
  };
  public singleListAppUser = (
    appUserFilter: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), appUserFilter)
      .pipe(Repository.responseMapToList<AppUser>(AppUser));
  };
  public filterListAppUser = (
    appUserFilter: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), appUserFilter)
      .pipe(Repository.responseMapToList<AppUser>(AppUser));
  };
  public singleListPermission = (
    permissionFilter: PermissionFilter
  ): Observable<Permission[]> => {
    return this.http
      .post<Permission[]>(
        kebabCase(nameof(this.singleListPermission)),
        permissionFilter
      )
      .pipe(Repository.responseMapToList<Permission>(Permission));
  };
  public filterListPermission = (
    permissionFilter: PermissionFilter
  ): Observable<Permission[]> => {
    return this.http
      .post<Permission[]>(
        kebabCase(nameof(this.filterListPermission)),
        permissionFilter
      )
      .pipe(Repository.responseMapToList<Permission>(Permission));
  };
  public singleListMenu = (menuFilter: MenuFilter): Observable<Menu[]> => {
    return this.http
      .post<Menu[]>(kebabCase(nameof(this.singleListMenu)), menuFilter)
      .pipe(Repository.responseMapToList<Menu>(Menu));
  };
  public singleListSite = (siteFilter: SiteFilter): Observable<Site[]> => {
    return this.http
      .post<Site[]>(kebabCase(nameof(this.singleListSite)), siteFilter)
      .pipe(Repository.responseMapToList<Site>(Site));
  };
  public singleListOrganization = (
    filter: OrganizationFilter
  ): Observable<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        filter
      )
      .pipe(Repository.responseMapToList<Organization>(Organization));
  };
  public singleListField = (
    filter: FieldModelFilter
  ): Observable<FieldModel[]> => {
    return this.http
      .post<FieldModel[]>(kebabCase(nameof(this.singleListField)), filter)
      .pipe(Repository.responseMapToList<FieldModel>(FieldModel));
  };
  public singleListPermissionOperator = (
    filter: PermissionOperatorFilter
  ): Observable<PermissionOperator[]> => {
    return this.http
      .post<PermissionOperator[]>(
        kebabCase(nameof(this.singleListPermissionOperator)),
        filter
      )
      .pipe(
        Repository.responseMapToList<PermissionOperator>(PermissionOperator)
      );
  };
  public filterListMenu = (menuFilter: MenuFilter): Observable<Menu[]> => {
    return this.http
      .post<Menu[]>(kebabCase(nameof(this.filterListMenu)), menuFilter)
      .pipe(Repository.responseMapToList<Menu>(Menu));
  };
  public singleListMasterData = (masterDataFilter: MasterDataFilter): Observable<MasterData[]> => {
    return this.http
      .post<MasterData[]>(kebabCase(nameof(this.singleListMasterData)), masterDataFilter)
      .pipe(Repository.responseMapToList<MasterData>(MasterData));
  };

  public countAppUser = (appUserFilter: AppUserFilter): Observable<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countAppUser)), appUserFilter)
      .pipe(Repository.responseDataMapper<number>());
  };
  public listAppUser = (
    appUserFilter: AppUserFilter
  ): Observable<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.listAppUser)), appUserFilter)
      .pipe(Repository.responseMapToList<AppUser>(AppUser));
  };
  public assignAppUser = (role: Role): Observable<Role> => {
    return this.http
      .post<Role>(kebabCase(nameof(this.assignAppUser)), role)
      .pipe(Repository.responseMapToModel<Role>(Role));
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
}

export const roleRepository = new RoleRepository();
