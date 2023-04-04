import { AxiosRequestConfig } from "axios";
import { MultipartBody } from "../../data/router-server/attachment";
import { Router } from "../../data/router-server/router";
import { Theme } from "../../model/model";
import { IdAndName, Single } from "../../model/model-side";
import { Adapter, Connection, ConnectionAxios } from "./adapter";
import { AuthTokenHandlerImpl } from "../auth_handler/auth-token";

interface ThemeAdapterInterface extends Adapter {
    getSearch(param: any, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getSearchData(param: any, callback: (data: Theme[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getMemberSearch(param: any, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getMemberSearchData(param: any, callback: (data: Theme[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    validate(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    save(body:MultipartBody<Theme> ,callback: (data?: Theme) => void, error: (errorMsg?: string) => void): Promise<void>;
    addTo(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    modify(body:MultipartBody<Theme> ,callback: (data?: Theme) => void, error: (errorMsg?: string) => void): Promise<void>;
    delete(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    removeFrom(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
}

export class ThemeAdapter implements ThemeAdapterInterface {
    constructor() {
        this.auth = new AuthTokenHandlerImpl(Router.Public.REFRESH.url,417)
        this.configurationAdapter = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': this.auth.get() ? this.auth.get() : ""
            },
            maxContentLength: 8000,
            maxBodyLength: 10000,
            timeout: 60000,
            maxRedirects: 10,
            responseType: 'json'
        } as AxiosRequestConfig
        this.route = new Router()
    }
    route: Router;
    auth: AuthTokenHandlerImpl;
    configurationAdapter: any;

    createConnection(): Connection {
        return new ConnectionAxios(this.auth);
    }


    async getSearch(param: typeof this.route.theme.SEARCH.params, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.theme.SEARCH.set("name",param?.name)
            .set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as IdAndName<string>[])
        else
            callback([]);
    }

    async getSearchData(param: typeof this.route.theme.SEARCH_DATA.params, callback: (data: Theme[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.theme.SEARCH_DATA.set("name",param?.name)
        .set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Theme[])
        else
            callback([])
    }

    async getMemberSearch(param: typeof this.route.theme.MEMBER_SEARCH.params, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.theme.MEMBER_SEARCH.set("name",param?.name)
            .set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as IdAndName<string>[])
        else
            callback([]);
    }

    async getMemberSearchData(param: typeof this.route.theme.MEMBER_SEARCH_DATA.params, callback: (data: Theme[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.theme.MEMBER_SEARCH_DATA.set("name",param?.name)
        .set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Theme[])
        else
            callback([])
    }

    async validate(param: typeof this.route.theme.VALIDATE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.theme.VALIDATE.set("name",param?.name),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Single<boolean>)
        else
            callback(undefined)
    }

    async save(body: MultipartBody<Theme>, callback: (data?: Theme | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        let formData = this.route.theme.SAVE.getBody() as FormData;
        if (body.image)
            formData.set("image",body.image)
        formData.set("data",JSON.stringify(body.data))
        const {data} = await this.createConnection().getConnection(this.route.theme.SAVE
            .addBody(formData),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'multipart/form-data'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Theme)
        else
            callback(undefined)
    }

    async addTo(param: typeof this.route.theme.ADD_THEME_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.theme.ADD_THEME_MEMBER.set("theme",param?.theme),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Single<boolean>)
        else
            callback(undefined)
    }

    async modify(body: MultipartBody<Theme>, callback: (data?: Theme | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        let formData = this.route.theme.MODIFY.getBody() as FormData;
        if (body.image)
            formData.set("image",body.image)
        formData.set("data",JSON.stringify(body.data))
        const {data} = await this.createConnection().getConnection(this.route.theme.MODIFY
            .addBody(formData),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'multipart/form-data'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Theme)
        else
            callback(undefined)
    }

    async delete(param: typeof this.route.theme.DELETE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.theme.DELETE.set("theme",param?.theme),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Single<boolean>)
        else
            callback(undefined)
    }

    async removeFrom(param: typeof this.route.theme.DELETE_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.theme.DELETE_MEMBER.set("theme",param?.theme),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Single<boolean>)
        else
            callback(undefined)
    }
}