import { Router } from "../../data/router-server/router";
import { Adapter, ConnectionAxios, Connection } from "./adapter";
import { Member, Subtype } from "../../model/model";
import { AxiosRequestConfig } from "axios";
import { MultipartBody } from "../../data/router-server/attachment";
import { Single } from "../../model/model-side";
import { AuthTokenHandlerImpl } from "../auth_handler/auth-token";

interface PublicAdapterInterface extends Adapter {
    getSubtype(param: any, callback: (data: Subtype[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getSubtypeSearch(param: any, callback: (data: Subtype[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    // getGroupAvatar(param: any, callback: (data?: string) => void, error: (errorMsg?: string) => void): Promise<void>;
    // getThemeImage(param: any, callback: (data?: string) => void, error: (errorMsg?: string) => void): Promise<void>;
    // getMemberAvatar(param: any, callback: (data?: string) => void, error: (errorMsg?: string) => void): Promise<void>;
    signIn(body: MultipartBody<Member>, callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void):Promise<void>;
    login(param: any, callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void):Promise<void>;
    // refresh(callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void):void;
}

export class PublicAdapter implements PublicAdapterInterface{    
    constructor() {
        this.auth = new AuthTokenHandlerImpl(Router.Public.REFRESH.url,417)
        this.configurationAdapter = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
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

    
    async getSubtype(param: typeof this.route.public.SUBTYPE.params, callback: (data: Subtype[]) => void, error: (errorMsg?: string) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.public.SUBTYPE
            .set("group",param?.group).set("name",param?.name)
            .set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data)
            callback(data as Subtype[])
        else
            callback([])
    }

    async getSubtypeSearch(param: typeof this.route.public.SUBTYPE_SEARCH.params, callback: (data: Subtype[]) => void, error: (errorMsg?: string) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.public.SUBTYPE_SEARCH
            .set("name",param?.name).set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data)
            callback(data as Subtype[])
        else
            callback([])
    }

    // async getGroupAvatar(param: typeof this.route.public.GROUP_AVATAR.params, callback: (data?: string) => void, error: (errorMsg?: string) => void): Promise<void> {
    //     const {data} = await this.createConnection().getConnection(this.route.public.GROUP_AVATAR
    //         .set("name",param?.name),{...this.configurationAdapter, responseType: 'arraybuffer'})
    //         .catch(err => {
    //             if (err.response) {
    //                 error(err.response.data)
    //             } else {
    //                 error(err.message)
    //             }
    //         })
    //     if (data) {
    //         let buffer = new Uint8Array(data)
    //         let blob = new Blob([buffer], {type: 'image/jpeg'})
    //         let url = window.URL || window.webkitURL
    //         callback(url.createObjectURL(blob))
    //     } else
    //         callback(undefined)
    // }

    // async getThemeImage(param: typeof this.route.public.THEME_IMAGE.params,callback: (data?: string) => void, error: (errorMsg?: string) => void): Promise<void> {
    //     const {data} = await this.createConnection().getConnection(this.route.public.THEME_IMAGE
    //         .set("name",param?.name),{...this.configurationAdapter, responseType: 'arraybuffer'})
    //         .catch(err => {
    //             if (err.response) {
    //                 error(err.response.data)
    //             } else {
    //                 error(err.message)
    //             }
    //         })
    //     if (data) {
    //         let buffer = new Uint8Array(data)
    //         let blob = new Blob([buffer], {type: 'image/jpeg'})
    //         let url = window.URL || window.webkitURL
    //         callback(url.createObjectURL(blob))
    //     } else
    //         callback(undefined)
    // }

    // async getMemberAvatar(param: typeof this.route.public.MEMBER_AVATAR.params, callback: (data?: string) => void, error: (errorMsg?: string) => void): Promise<void> {
    //     const {data} = await this.createConnection().getConnection(this.route.public.MEMBER_AVATAR
    //         .set("name",param?.name),{...this.configurationAdapter, responseType: 'arraybuffer'})
    //         .catch(err => {
    //             if (err.response) {
    //                 error(err.response.data)
    //             } else {
    //                 error(err.message)
    //             }
    //         })
    //     if (data) {
    //         let buffer = new Uint8Array(data)
    //         let blob = new Blob([buffer], {type: 'image/jpeg'})
    //         let url = window.URL || window.webkitURL
    //         callback(url.createObjectURL(blob))
    //     } else
    //         callback(undefined)
    // }

    async signIn(body: MultipartBody<Member>, callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void): Promise<void> {
        let formData = this.route.public.SIGNIN.getBody() as FormData;
        if (body.image)
            formData.set("image",body.image)
        formData.set("data",JSON.stringify(body.data))
        const {data} = await this.createConnection().getConnection(this.route.public.SIGNIN
            .addBody(formData),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'multipart/form-data'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) {
            callback(data as Single<string>)
        } else
            callback(undefined)
    }

    async login(param: typeof this.route.public.LOGIN.params, callback: (data?: Single<string> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.public.LOGIN
            .set("username",param?.username).set("password",param?.password),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) {
            callback(data as Single<string>)
        } else
            callback(undefined)
    }

    // async refresh(callback: (data?: Single<string> | undefined) => void, error: (errorMsg?: string | undefined) => void) {
    //     const {data} = await this.createConnection().getConnection(this.route.public.REFRESH,this.configurationAdapter)
    //         .catch(err => {
    //             if (err.response) {
    //                 error(err.response.data)
    //             } else {
    //                 error(err.message)
    //             }
    //         })
    //     if (status == 200) {
    //         callback(data as Single<string>)
    //     } else
    //         callback(undefined)
    // }
}