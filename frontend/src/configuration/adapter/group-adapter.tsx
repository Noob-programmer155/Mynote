import { AxiosRequestConfig } from "axios";
import { MultipartBody } from "../../data/router-server/attachment";
import { GroupUrl, Router } from "../../data/router-server/router";
import { Group, Member } from "../../model/model";
import { IdAndName, Single } from "../../model/model-side";
import { Adapter, Connection, ConnectionAxios } from "./adapter";
import { AuthTokenHandlerImpl } from "../auth_handler/auth-token";

interface GroupAdapterInterface extends Adapter {
    getSearch(param: any, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getSearchData(param: any, callback: (data: Group[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    validate(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    getAllMemberQueue(param: any, callback: (data: Member[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getAllRejectedRequestQueue(param: any, callback: (data: Member[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getAllMember(param: any, callback: (data: Member[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    sendRequestMember(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    sendRejectMember(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    sendConfirmMember(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    save(body:MultipartBody<Group> ,callback: (data?: Group) => void, error: (errorMsg?: string) => void): Promise<void>;
    modify(body:MultipartBody<Group> ,callback: (data?: Group) => void, error: (errorMsg?: string) => void): Promise<void>;
    modifyPassword(param:any ,callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    promoteMember(param:any ,callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    demoteMember(param:any ,callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    delete(param:any ,callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    removeMember(param:any ,callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
}

export class GroupAdapter implements GroupAdapterInterface {
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

    async getSearch(param: typeof this.route.group.SEARCH.params, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.SEARCH.set("name",param?.name)
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

    async getSearchData(param: typeof this.route.group.SEARCH_DATA.params, callback: (data: Group[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.SEARCH_DATA.set("name",param?.name)
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

    async validate(param: typeof this.route.group.VALIDATE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.VALIDATE.set("name",param?.name),this.configurationAdapter)
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

    async getAllMemberQueue(param: typeof this.route.group.NOTIF_CONFIRM_MEMBER.params, callback: (data: Member[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.NOTIF_CONFIRM_MEMBER.set("group",param?.group)
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

    async getAllRejectedRequestQueue(param: typeof this.route.group.NOTIF_REJECT_MEMBER.params, callback: (data: Member[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.NOTIF_REJECT_MEMBER.set("group",param?.group)
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

    async getAllMember(param: typeof this.route.group.MEMBERS_GROUP.params, callback: (data: Member[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.MEMBERS_GROUP.set("group",param?.group)
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

    async sendRequestMember(param: typeof this.route.group.POST_SEND_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.POST_SEND_MEMBER.set("group",param?.group)
            .set("member",param?.member),this.configurationAdapter)
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

    async sendRejectMember(param: typeof this.route.group.POST_REJECT_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.POST_REJECT_MEMBER.set("group",param?.group)
        .set("member",param?.member),this.configurationAdapter)
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

    async sendConfirmMember(param: typeof this.route.group.POST_CONFIRM_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.POST_CONFIRM_MEMBER.set("group",param?.group)
        .set("member",param?.member),this.configurationAdapter)
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

    async save(body: MultipartBody<Group>, callback: (data?: Group | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        let formData = this.route.group.SAVE.getBody() as FormData;
        if (body.image)
            formData.set("image",body.image)
        formData.set("data",JSON.stringify(body.data))
        const {data} = await this.createConnection().getConnection(this.route.group.SAVE
            .addBody(formData),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'multipart/form-data'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Group)
        else
            callback(undefined)
    }

    async modify(body: MultipartBody<Group>, callback: (data?: Group | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        let formData = this.route.group.MODIFY.getBody() as FormData;
        if (body.image)
            formData.set("image",body.image)
        formData.set("data",JSON.stringify(body.data))
        const {data} = await this.createConnection().getConnection(this.route.group.MODIFY
            .addBody(formData),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'multipart/form-data'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Group)
        else
            callback(undefined)
    }

    async modifyPassword(param: typeof this.route.group.MODIFY_PASSWORD.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.MODIFY_PASSWORD.set("group",param?.group)
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
    
    async promoteMember(param: typeof this.route.group.ROLE_PROMOTE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.ROLE_PROMOTE.set("group",param?.group)
        .set("member",param?.member),this.configurationAdapter)
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

    async demoteMember(param: typeof this.route.group.ROLE_DEMOTE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.ROLE_DEMOTE.set("group",param?.group)
        .set("member",param?.member),this.configurationAdapter)
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

    async delete(param: typeof this.route.group.DELETE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.DELETE.set("group",param?.group),this.configurationAdapter)
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

    async removeMember(param: typeof this.route.group.DELETE_MEMBER.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.group.DELETE_MEMBER.set("group",param?.group)
        .set("member",param?.member),this.configurationAdapter)
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