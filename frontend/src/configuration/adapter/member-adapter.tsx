import { AxiosRequestConfig } from "axios";
import {Router} from "../../data/router-server/router"
import { Group, Member } from "../../model/model";
import { IdAndName, Single } from "../../model/model-side";
import { MultipartBody } from "../../data/router-server/attachment";
import { Adapter, Connection, ConnectionAxios } from "./adapter";
import { AuthTokenHandlerImpl } from "../auth_handler/auth-token";

interface MemberAdapterInterface extends Adapter {
    getProfile(callback: (data?: Member) => void, error: (errorMsg?: string) => void): Promise<void>;
    getSearch(param: any, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getSearchData(param: any, callback: (data: Member[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    validate(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    getAllMemberGroup(param: any, callback: (data: Group[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getAllGroupQueue(param: any, callback: (data: Group[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getAllGroupRejected(param: any, callback: (data: Group[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    logout(callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    sendRequestGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    sendRejectGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    sendConfirmGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    modify(body: MultipartBody<Member>, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    modifyPassword(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    deleteGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
}

export class MemberAdapter implements MemberAdapterInterface {
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


    async getProfile(callback: (data?: Member | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.PROFILE,this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Member)
        else
            callback(undefined)
    }

    async getSearch(param: typeof this.route.member.SEARCH.params, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.SEARCH.set("name",param?.name)
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
            callback([])
    }
    
    async getSearchData(param: typeof this.route.member.SEARCH_DATA.params, callback: (data: Member[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.SEARCH_DATA.set("name",param?.name)
            .set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Member[])
        else
            callback([])
    }

    async validate(param: typeof this.route.member.VALIDATE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.VALIDATE.set("name",param?.name),this.configurationAdapter)
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

    async getAllMemberGroup(param: typeof this.route.member.GROUPS.params, callback: (data: Group[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.GROUPS
            .set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Group[])
        else
            callback([])
    }

    async getAllGroupQueue(param: typeof this.route.member.NOTIF_WAIT_GROUP.params, callback: (data: Group[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.NOTIF_WAIT_GROUP
            .set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Group[])
        else
            callback([])
    }

    async getAllGroupRejected(param: typeof this.route.member.NOTIF_REJECT_GROUP.params, callback: (data: Group[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.NOTIF_REJECT_GROUP
            .set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Group[])
        else
            callback([])
    }

    async logout(callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.LOGOUT,this.configurationAdapter)
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

    async sendRequestGroup(param: typeof this.route.member.POST_SEND_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.POST_SEND_GROUP.set("group",param?.group),this.configurationAdapter)
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

    async sendRejectGroup(param: typeof this.route.member.POST_REJECT_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.POST_REJECT_GROUP.set("group",param?.group),this.configurationAdapter)
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

    async sendConfirmGroup(param: typeof this.route.member.POST_CONFIRM_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.POST_CONFIRM_GROUP.set("group",param?.group),this.configurationAdapter)
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

    async modify(body: MultipartBody<Member>, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        let formData = this.route.member.MODIFY.getBody() as FormData;
        if (body.image)
            formData.set("image",body.image)
        formData.set("data",JSON.stringify(body.data))
        const {data} = await this.createConnection().getConnection(this.route.member.MODIFY
            .addBody(formData),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'multipart/form-data'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) {
            this.auth.set(data.data)
            callback({data: true} as Single<boolean>)
        }
        else
            callback(undefined)
    }

    async modifyPassword(param: typeof this.route.member.MODIFY_PASSWORD.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.MODIFY_PASSWORD
            .set("newPassword",param?.newPassword).set("oldPassword",param?.oldPassword),this.configurationAdapter)
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

    async deleteGroup(param: typeof this.route.member.DELETE_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.member.DELETE_GROUP
            .set("group",param?.group),this.configurationAdapter)
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