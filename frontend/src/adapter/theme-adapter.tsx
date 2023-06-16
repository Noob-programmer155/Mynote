import { AxiosRequestConfig } from "axios";
import { MultipartBody } from "../model/data/router-server/attachment";
import { Router } from "../model/data/router-server/router";
import { Theme } from "../model/model";
import { IdAndName, Single } from "../model/model-side";
import { Adapter, Connection, ConnectionAxios } from "./adapter";
import { AuthTokenHandlerImpl } from "./auth_handler/auth-token";
import { bearer_name } from "../model/data/resource/resource";

interface ThemeAdapterInterface extends Adapter {
    getSearch(param: any, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSearchData(param: any, callback: (data: Theme[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getMemberSearch(param: any, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getMemberSearchData(param: any, callback: (data: Theme[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    validate(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    activateTheme(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    save(body:MultipartBody<Theme> ,callback: (data?: Theme) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    addTo(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    modify(body:MultipartBody<Theme> ,callback: (data?: Theme) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    delete(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    removeFrom(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
}

export class ThemeAdapter implements ThemeAdapterInterface {
    constructor(data: AuthTokenHandlerImpl) {
        this.auth = data
        this.configurationAdapter = () => {
            return {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Authorization': `${bearer_name} ${this.auth.get() ? this.auth.get() : ""}`
                },
                maxContentLength: 8000,
                maxBodyLength: 10000,
                timeout: 60000,
                maxRedirects: 10,
                responseType: 'json'
            } as AxiosRequestConfig
        }
        this.route = new Router()
    }
    route: Router;
    auth: AuthTokenHandlerImpl;
    configurationAdapter: () => AxiosRequestConfig;

    createConnection(): Connection {
        return new ConnectionAxios(this.auth);
    }


    async getSearch(param: typeof this.route.theme.SEARCH.params, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.theme.SEARCH.set({name:param!.name,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as IdAndName<string>[])
            else
                callback([])
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async getSearchData(param: typeof this.route.theme.SEARCH_DATA.params, callback: (data: Theme[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.theme.SEARCH_DATA.set({name:param!.name,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Theme[])
            else
                callback([]) 
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async getMemberSearch(param: typeof this.route.theme.MEMBER_SEARCH.params, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.theme.MEMBER_SEARCH.set({name:param!.name,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as IdAndName<string>[])
            else
                callback([])
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async getMemberSearchData(param: typeof this.route.theme.MEMBER_SEARCH_DATA.params, callback: (data: Theme[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
        const {data} = await this.createConnection().getConnection(this.route.theme.MEMBER_SEARCH_DATA.set({name:param!.name,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)
        if (data) 
            callback(data as Theme[])
        else
            callback([]) 
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async validate(param: typeof this.route.theme.VALIDATE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.theme.VALIDATE.set({name:param!.name}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Single<boolean>)
            else
                callback(undefined) 
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async activateTheme(param: typeof this.route.theme.ACTIVATE_THEME.params, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> {
        try {
            const {data} = await this.createConnection().getConnection(this.route.theme.ACTIVATE_THEME.set({theme:param!.theme}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Single<boolean>)
            else
                callback(undefined) 
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async save(body: MultipartBody<Theme>, callback: (data?: Theme | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            let formData = this.route.theme.SAVE.getBody() as FormData;
            if (body.image)
                formData.set("image",body.image)
            formData.set("data",JSON.stringify(body.data))
            const {data} = await this.createConnection().getConnection(this.route.theme.SAVE
                .addBody(formData),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'multipart/form-data'}},toLogin)
            if (data) 
                callback(data as Theme)
            else
                callback(undefined) 
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async addTo(param: typeof this.route.theme.ADD_THEME_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.theme.ADD_THEME_MEMBER.set({theme:param!.theme}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Single<boolean>)
            else
                callback(undefined) 
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async modify(body: MultipartBody<Theme>, callback: (data?: Theme | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            let formData = this.route.theme.MODIFY.getBody() as FormData;
            if (body.image)
                formData.set("image",body.image)
            formData.set("data",JSON.stringify(body.data))
            const {data} = await this.createConnection().getConnection(this.route.theme.MODIFY
                .addBody(formData),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'multipart/form-data'}},toLogin)
            if (data) 
                callback(data as Theme)
            else
                callback(undefined) 
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async delete(param: typeof this.route.theme.DELETE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.theme.DELETE.set({theme:param!.theme}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Single<boolean>)
            else
                callback(undefined) 
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async removeFrom(param: typeof this.route.theme.DELETE_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.theme.DELETE_MEMBER.set({theme:param!.theme}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Single<boolean>)
            else
                callback(undefined) 
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }
}