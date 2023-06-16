import { Router } from "../model/data/router-server/router";
import { Adapter, ConnectionAxios, Connection } from "./adapter";
import { Member, Subtype } from "../model/model";
import { AxiosRequestConfig } from "axios";
import { MultipartBody } from "../model/data/router-server/attachment";
import { Login, Single } from "../model/model-side";
import { AuthTokenHandlerImpl } from "./auth_handler/auth-token";

interface PublicAdapterInterface extends Adapter {
    validateUserName(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSubtype(param: any, callback: (data: Subtype[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSubtypeSearch(param: any, callback: (data: Subtype[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    // getGroupAvatar(param: any, callback: (data?: string) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    // getThemeImage(param: any, callback: (data?: string) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    // getMemberAvatar(param: any, callback: (data?: string) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    signIn(body: MultipartBody<Member>, callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void):Promise<void>;
    login(body: Login, callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void):Promise<void>;
    // refresh(callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void):void;
}

export class PublicAdapter implements PublicAdapterInterface{    
    constructor(data: AuthTokenHandlerImpl) {
        this.auth = data
        this.configurationAdapter = () => {
            return {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
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

    
    async getSubtype(param: typeof this.route.public.SUBTYPE.params, callback: (data: Subtype[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.public.SUBTYPE
                .set({group:param!.group}),this.configurationAdapter(),toLogin)    
            if (data)
                callback(data as Subtype[])
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

    async getSubtypeSearch(param: typeof this.route.public.SUBTYPE_SEARCH.params, callback: (data: Subtype[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.public.SUBTYPE_SEARCH
                .set({name:param!.name,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin) 
            if (data)
                callback(data as Subtype[])
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

    async validateUserName(param: typeof this.route.public.VALIDATE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.public.VALIDATE.set({name:param!.name}),this.configurationAdapter(),toLogin)
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

    // async getGroupAvatar(param: typeof this.route.public.GROUP_AVATAR.params, callback: (data?: string) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void> { try {
    //     const {data} = await this.createConnection().getConnection(this.route.public.GROUP_AVATAR
    //         .set("name",param?.name),{...this.configurationAdapter(), responseType: 'arraybuffer'})
    //         .catch(err => {
    //             if (err) {
    //                 error(err.data.message)
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

    // async getThemeImage(param: typeof this.route.public.THEME_IMAGE.params,callback: (data?: string) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void> { try {
    //     const {data} = await this.createConnection().getConnection(this.route.public.THEME_IMAGE
    //         .set("name",param?.name),{...this.configurationAdapter(), responseType: 'arraybuffer'})
    //         .catch(err => {
    //             if (err) {
    //                 error(err.data.message)
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

    // async getMemberAvatar(param: typeof this.route.public.MEMBER_AVATAR.params, callback: (data?: string) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void> { try {
    //     const {data} = await this.createConnection().getConnection(this.route.public.MEMBER_AVATAR
    //         .set("name",param?.name),{...this.configurationAdapter(), responseType: 'arraybuffer'})
    //         .catch(err => {
    //             if (err) {
    //                 error(err.data.message)
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

    async signIn(body: MultipartBody<Member>, callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            let formData = this.route.public.SIGNIN.getBody() as FormData;
            if (body.image)
                formData.set("image",body.image)
            formData.set("data",JSON.stringify(body.data))
            const {data} = await this.createConnection().getConnection(this.route.public.SIGNIN
                .addBody(formData),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'multipart/form-data'}},toLogin)
            if (data) {
                let token = data as Single<string>
                this.auth.set(token.data)
                callback({data:"SignIn Successful"})
            } else
                callback(undefined) 
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async login(body: Login, callback: (data?: Single<string> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.public.LOGIN
                .addBody(JSON.stringify(body)),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'application/json'}},toLogin)
            if (data) {
                let token = data as Single<string>
                this.auth.set(token.data)
                callback({data:"Login Successful"})
            } else
                callback(undefined)
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    // async refresh(callback: (data?: Single<string> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void) {
    //     const {data} = await this.createConnection().getConnection(this.route.public.REFRESH,this.configurationAdapter(),toLogin)
    //         .catch(err => {
    //             if (err) {
    //                 error(err.data.message)
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