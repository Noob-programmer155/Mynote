import { AxiosRequestConfig } from "axios";
import { MultipartBody } from "../model/data/router-server/attachment";
import { Router } from "../model/data/router-server/router";
import { Group, Member } from "../model/model";
import { IdAndName, Single } from "../model/model-side";
import { ConnectionAxios } from "./adapter";
import { AuthTokenHandlerImpl } from "./auth_handler/auth-token";
import { bearer_name } from "../usecase/resource";
import { Adapter, Connection } from "../usecase/adapter";

interface GroupAdapterInterface extends Adapter {
    getSearch(param: any, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSearchData(param: any, callback: (data: Group[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    validate(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getAllMemberQueue(param: any, callback: (data: Member[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getAllRejectedRequestQueue(param: any, callback: (data: Member[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getAllMember(param: any, callback: (data: Member[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    sendRequestMember(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    sendRejectMember(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    sendConfirmMember(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    save(body:MultipartBody<Group> ,callback: (data?: Group) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    modify(body:MultipartBody<Group> ,callback: (data?: Group) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    promoteMember(param:any ,callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    demoteMember(param:any ,callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    delete(param:any ,callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    removeMember(param:any ,callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
}

export class GroupAdapter implements GroupAdapterInterface {
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

    async getSearch(param: typeof Router.Group.SEARCH.params, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.SEARCH.set({name:param!.name,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as IdAndName<string>[])
            else
                callback([]);
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async getSearchData(param: typeof Router.Group.SEARCH_DATA.params, callback: (data: Group[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.SEARCH_DATA.set({name:param!.name,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)      
            if (data)
                callback(data as Group[])
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

    async validate(param: typeof Router.Group.VALIDATE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.VALIDATE.set({name:param!.name}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Single<boolean>)
            else
                callback(undefined) } 
        catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }

    async getAllMemberQueue(param: typeof Router.Group.NOTIF_CONFIRM_MEMBER.params, callback: (data: Member[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.NOTIF_CONFIRM_MEMBER.set({group:param!.group,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Member[])
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

    async getAllRejectedRequestQueue(param: typeof Router.Group.NOTIF_REJECT_MEMBER.params, callback: (data: Member[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.NOTIF_REJECT_MEMBER.set({group:param!.group,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Member[])
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

    async getAllMember(param: typeof Router.Group.MEMBERS_GROUP.params, callback: (data: Member[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.MEMBERS_GROUP.set({group:param!.group}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Member[])
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

    async sendRequestMember(param: typeof Router.Group.POST_SEND_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> {
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.POST_SEND_MEMBER.set({group:param!.group,member:param!.member}),this.configurationAdapter(),toLogin)
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

    async sendRejectMember(param: typeof Router.Group.POST_REJECT_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.POST_REJECT_MEMBER.set({group:param!.group,member:param!.member}),this.configurationAdapter(),toLogin)
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

    async sendConfirmMember(param: typeof Router.Group.POST_CONFIRM_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.POST_CONFIRM_MEMBER.set({group:param!.group,member:param!.member}),this.configurationAdapter(),toLogin)
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

    async save(body: MultipartBody<Group>, callback: (data?: Group | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            let formData = this.route.group.SAVE.getBody() as FormData;
            if (body.image)
                formData.set("image",body.image)
            formData.set("data",JSON.stringify(body.data))
            const {data} = await this.createConnection().getConnection(this.route.group.SAVE
                .addBody(formData),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'multipart/form-data'}},toLogin)
            if (data) 
                callback(data as Group)
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

    async modify(body: MultipartBody<Group>, callback: (data?: Group | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            let formData = this.route.group.MODIFY.getBody() as FormData;
            if (body.image)
                formData.set("image",body.image)
            formData.set("data",JSON.stringify(body.data))
            const {data} = await this.createConnection().getConnection(this.route.group.MODIFY
                .addBody(formData),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'multipart/form-data'}},toLogin)
            if (data) 
                callback(data as Group)
            else
                callback(undefined) 
        } catch(err:any) {if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }
    
    async promoteMember(param: typeof Router.Group.ROLE_PROMOTE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.ROLE_PROMOTE.set({group:param!.group,member:param!.member}),this.configurationAdapter(),toLogin)
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

    async demoteMember(param: typeof Router.Group.ROLE_DEMOTE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.ROLE_DEMOTE.set({group:param!.group,member:param!.member}),this.configurationAdapter(),toLogin)
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

    async delete(param: typeof Router.Group.DELETE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.DELETE.set({group:param!.group}),this.configurationAdapter(),toLogin)
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

    async removeMember(param: typeof Router.Group.DELETE_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.group.DELETE_MEMBER.set({group:param!.group,member:param!.member}),this.configurationAdapter(),toLogin)
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