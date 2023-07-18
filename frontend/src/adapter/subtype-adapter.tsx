import { AxiosRequestConfig } from "axios";
import { Router } from "../model/data/router-server/router";
import { Subtype } from "../model/model";
import { Single } from "../model/model-side";
import { ConnectionAxios } from "./adapter";
import { AuthTokenHandlerImpl } from "./auth_handler/auth-token";
import { bearer_name } from "../usecase/resource";
import { Adapter, Connection } from "../usecase/adapter";

interface SubtypeAdapterInterface extends Adapter {
    updateIndex(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    save(param: any,body: Subtype, callback: (data?: Subtype) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    modify(param: any,body: Subtype, callback: (data?: Subtype) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    removeGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
}

export class SubtypeAdapter implements SubtypeAdapterInterface {
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


    async updateIndex(param: typeof this.route.subtype.UPDATE_INDEX.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.subtype.UPDATE_INDEX
                .set({indexFrom:param!.indexFrom,indexTo:param!.indexTo,subtypeFrom:param!.subtypeFrom,subtypeTo:param!.subtypeTo,group:param!.group}),this.configurationAdapter(),toLogin)
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
    async save(param: typeof this.route.subtype.SAVE.params,body: Subtype, callback: (data?: Subtype | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.subtype.SAVE.set({index:param!.index,group:param!.group})
                .addBody(JSON.stringify(body)),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'application/json'}}, toLogin)
            if (data) 
                callback(data as Subtype)
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

    async modify(param: typeof this.route.subtype.MODIFY.params,body: Subtype, callback: (data?: Subtype | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.subtype.MODIFY.set({index:param!.index,oldSubtype:param!.oldSubtype,group:param!.group})
                .addBody(JSON.stringify(body)),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'application/json'}}, toLogin)
            if (data) 
                callback(data as Subtype)
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

    async removeGroup(param: typeof this.route.subtype.DELETE_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.subtype.DELETE_GROUP.set({group:param!.group,subtype:param!.subtype}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Single<boolean>)
            else
                callback(undefined);
        } catch(err:any) {
            if (err.data) {
                error(err.data.message)
            } else {
                error(err.message)
            }
        }
    }
}