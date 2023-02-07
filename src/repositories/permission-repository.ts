import { Repository } from "react3l-common";
import { kebabCase } from "lodash";
import { httpConfig } from 'config/http';
import { BASE_API_URL } from "config/consts";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";

import nameof from "ts-nameof.macro";

import { API_PERMISSION_PREFIX } from "config/api-consts";
import { Permission, PermissionFilter } from 'models/Permission';
import { Menu, MenuFilter } from 'models/Menu';
import { Role, RoleFilter } from 'models/Role';
import { PermissionActionMapping, PermissionActionMappingFilter } from 'models/PermissionActionMapping';
import { Action, ActionFilter } from 'models/Action';
import { PermissionFieldMapping, PermissionFieldMappingFilter } from 'models/PermissionFieldMapping';
import { FieldModel, FieldModelFilter } from 'models/FieldModel';

export type KeyType = string | number;

export class PermissionRepository extends Repository {
    constructor() {
        super(httpConfig);
        this.baseURL = new URL(API_PERMISSION_PREFIX, BASE_API_URL).href;
    }

    public count = (permissionFilter?: PermissionFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.count)), permissionFilter)
            .pipe(Repository.responseDataMapper<number>());
    };

    public list = (permissionFilter?: PermissionFilter): Observable<Permission[]> => {
        return this.http.post<Permission[]>(kebabCase(nameof(this.list)), permissionFilter)
            .pipe(Repository.responseMapToList<Permission>(Permission));
    };

    public get = (id: number | string): Observable<Permission> => {
        return this.http.post<Permission>
            (kebabCase(nameof(this.get)), { id })
            .pipe(Repository.responseMapToModel<Permission>(Permission));
    };

    public create = (permission: Permission): Observable<Permission> => {
        return this.http.post<Permission>(kebabCase(nameof(this.create)), permission)
            .pipe(Repository.responseMapToModel<Permission>(Permission));
    };

    public update = (permission: Permission): Observable<Permission> => {
        return this.http.post<Permission>(kebabCase(nameof(this.update)), permission)
            .pipe(Repository.responseMapToModel<Permission>(Permission));
    };

    public delete = (permission: Permission): Observable<Permission> => {
        return this.http.post<Permission>(kebabCase(nameof(this.delete)), permission)
            .pipe(Repository.responseMapToModel<Permission>(Permission));
    };

    public bulkDelete = (idList: KeyType[]): Observable<void> => {
        return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
            .pipe(Repository.responseDataMapper());
    };

    public save = (permission: Permission): Observable<Permission> => {
        return permission.id ? this.update(permission) : this.create(permission);
    };

    public singleListMenu = (menuFilter: MenuFilter): Observable<Menu[]> => {
        return this.http.post<Menu[]>(kebabCase(nameof(this.singleListMenu)), menuFilter)
            .pipe(Repository.responseMapToList<Menu>(Menu));
    }
    public filterListMenu = (menuFilter: MenuFilter): Observable<Menu[]> => {
        return this.http.post<Menu[]>(kebabCase(nameof(this.filterListMenu)), menuFilter)
            .pipe(Repository.responseMapToList<Menu>(Menu));
    };
    public singleListRole = (roleFilter: RoleFilter): Observable<Role[]> => {
        return this.http.post<Role[]>(kebabCase(nameof(this.singleListRole)), roleFilter)
            .pipe(Repository.responseMapToList<Role>(Role));
    }
    public filterListRole = (roleFilter: RoleFilter): Observable<Role[]> => {
        return this.http.post<Role[]>(kebabCase(nameof(this.filterListRole)), roleFilter)
            .pipe(Repository.responseMapToList<Role>(Role));
    };
    public singleListPermissionActionMapping = (permissionActionMappingFilter: PermissionActionMappingFilter): Observable<PermissionActionMapping[]> => {
        return this.http.post<PermissionActionMapping[]>(kebabCase(nameof(this.singleListPermissionActionMapping)), permissionActionMappingFilter)
            .pipe(Repository.responseMapToList<PermissionActionMapping>(PermissionActionMapping));
    }
    public filterListPermissionActionMapping = (permissionActionMappingFilter: PermissionActionMappingFilter): Observable<PermissionActionMapping[]> => {
        return this.http.post<PermissionActionMapping[]>(kebabCase(nameof(this.filterListPermissionActionMapping)), permissionActionMappingFilter)
            .pipe(Repository.responseMapToList<PermissionActionMapping>(PermissionActionMapping));
    };
    public singleListAction = (actionFilter: ActionFilter): Observable<Action[]> => {
        return this.http.post<Action[]>(kebabCase(nameof(this.singleListAction)), actionFilter)
            .pipe(Repository.responseMapToList<Action>(Action));
    }
    public filterListAction = (actionFilter: ActionFilter): Observable<Action[]> => {
        return this.http.post<Action[]>(kebabCase(nameof(this.filterListAction)), actionFilter)
            .pipe(Repository.responseMapToList<Action>(Action));
    };
    public singleListPermissionFieldMapping = (permissionFieldMappingFilter: PermissionFieldMappingFilter): Observable<PermissionFieldMapping[]> => {
        return this.http.post<PermissionFieldMapping[]>(kebabCase(nameof(this.singleListPermissionFieldMapping)), permissionFieldMappingFilter)
            .pipe(Repository.responseMapToList<PermissionFieldMapping>(PermissionFieldMapping));
    }
    public filterListPermissionFieldMapping = (permissionFieldMappingFilter: PermissionFieldMappingFilter): Observable<PermissionFieldMapping[]> => {
        return this.http.post<PermissionFieldMapping[]>(kebabCase(nameof(this.filterListPermissionFieldMapping)), permissionFieldMappingFilter)
            .pipe(Repository.responseMapToList<PermissionFieldMapping>(PermissionFieldMapping));
    };
    public singleListField = (fieldFilter: FieldModelFilter): Observable<FieldModel[]> => {
        return this.http.post<FieldModel[]>(kebabCase(nameof(this.singleListField)), fieldFilter)
            .pipe(Repository.responseMapToList<FieldModel>(FieldModel));
    }
    public filterListField = (fieldFilter: FieldModelFilter): Observable<FieldModel[]> => {
        return this.http.post<FieldModel[]>(kebabCase(nameof(this.filterListField)), fieldFilter)
            .pipe(Repository.responseMapToList<FieldModel>(FieldModel));
    };

    public countAction = (actionFilter: ActionFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.countAction)), actionFilter)
            .pipe(Repository.responseDataMapper<number>());
    };
    public listAction = (actionFilter: ActionFilter): Observable<Action[]> => {
        return this.http.post<Action[]>(kebabCase(nameof(this.listAction)), actionFilter)
            .pipe(Repository.responseMapToList<Action>(Action));
    };

    public countField = (fieldFilter: FieldModelFilter): Observable<number> => {
        return this.http.post<number>(kebabCase(nameof(this.countField)), fieldFilter)
            .pipe(Repository.responseDataMapper<number>());
    };
    public listField = (fieldFilter: FieldModelFilter): Observable<FieldModel[]> => {
        return this.http.post<FieldModel[]>(kebabCase(nameof(this.listField)), fieldFilter)
            .pipe(Repository.responseMapToList<FieldModel>(FieldModel));
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

export const permissionRepository = new PermissionRepository();
