import { AxiosRequestConfig } from "axios";
import {Router} from "../model/data/router-server/router"
import { Group, Member } from "../model/model";
import { IdAndName, Password, Single } from "../model/model-side";
import { MultipartBody } from "../model/data/router-server/attachment";
import { ConnectionAxios } from "./adapter";
import { AuthTokenHandlerImpl } from "./auth_handler/auth-token";
import { bearer_name } from "../model/resource";
import { Connection, MemberAdapterInterface } from "../usecase/adapter";

export class MemberAdapter implements MemberAdapterInterface {
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


    async getProfile(callback: (data?: Member | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.PROFILE,this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Member)
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

    async getSearch(param: typeof this.route.member.SEARCH.params, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.SEARCH.set({name:param!.name,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin) 
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
    
    async getSearchData(param: typeof this.route.member.SEARCH_DATA.params, callback: (data: Member[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.SEARCH_DATA.set({name:param!.name,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)
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

    async getAllMemberGroup(param: typeof this.route.member.GROUPS.params, callback: (data: Group[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.GROUPS.set({member:param!.member}),this.configurationAdapter(),toLogin)     
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

    async getAllGroupQueue(param: typeof this.route.member.NOTIF_WAIT_GROUP.params, callback: (data: Group[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.NOTIF_WAIT_GROUP
                .set({page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)   
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

    async getAllGroupRejected(param: typeof this.route.member.NOTIF_REJECT_GROUP.params, callback: (data: Group[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.NOTIF_REJECT_GROUP
                .set({page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)    
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

    async logout(callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.LOGOUT,this.configurationAdapter(),toLogin)
            if (data) {
                this.auth.delete()
                callback(data as Single<boolean>)
            }
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

    async sendRequestGroup(param: typeof this.route.member.POST_SEND_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.POST_SEND_GROUP.set({group:param!.group}),this.configurationAdapter(),toLogin)
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

    async sendRejectGroup(param: typeof this.route.member.POST_REJECT_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.POST_REJECT_GROUP.set({group:param!.group}),this.configurationAdapter(),toLogin)
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

    async sendConfirmGroup(param: typeof this.route.member.POST_CONFIRM_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.POST_CONFIRM_GROUP.set({group:param!.group}),this.configurationAdapter(),toLogin)
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

    async modify(body: MultipartBody<Member>, callback: (data?: Single<string> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            let formData = this.route.member.MODIFY.getBody() as FormData;
            if (body.image)
                formData.set("image",body.image)
            formData.set("data",JSON.stringify(body.data))
            const {data} = await this.createConnection().getConnection(this.route.member.MODIFY
                .addBody(formData),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'multipart/form-data'}},toLogin)
            if (data) {
                let token = data as Single<string>
                this.auth.set(token.data)
                callback({data:"Modify Successful"})
            }
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

    async modifyPassword(body: Password, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.MODIFY_PASSWORD
                .addBody(JSON.stringify(body)),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'application/json'}},toLogin)
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

    async deleteGroup(param: typeof this.route.member.DELETE_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.member.DELETE_GROUP
                .set({group:param!.group,member:param!.member}),this.configurationAdapter(),toLogin)
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