import { AxiosRequestConfig } from "axios";
import { Router } from "../../data/router-server/router";
import { Subtype } from "../../model/model";
import { Single } from "../../model/model-side";
import { Adapter, Connection, ConnectionAxios } from "./adapter";
import { AuthTokenHandlerImpl } from "../auth_handler/auth-token";

interface SubtypeAdapterInterface extends Adapter {
    addGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    save(body: Subtype, callback: (data?: Subtype) => void, error: (errorMsg?: string) => void): Promise<void>;
    modify(body: Subtype, callback: (data?: Subtype) => void, error: (errorMsg?: string) => void): Promise<void>;
    removeGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
}

export class SubtypeAdapter implements SubtypeAdapterInterface {
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


    async addGroup(param: typeof this.route.subtype.ADD_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.subtype.ADD_GROUP.set("group",param?.group)
            .set("subtype",param?.subtype),this.configurationAdapter)
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
            callback(undefined);
    }
    async save(body: Subtype, callback: (data?: Subtype | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.subtype.SAVE
            .addBody(JSON.stringify(body)),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'application/json'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Subtype)
        else
            callback(undefined);
    }

    async modify(body: Subtype, callback: (data?: Subtype | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.subtype.MODIFY
            .addBody(JSON.stringify(body)),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'application/json'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as Subtype)
        else
            callback(undefined);
    }

    async removeGroup(param: typeof this.route.subtype.DELETE_GROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.subtype.DELETE_GROUP.set("group",param?.group)
            .set("subtype",param?.subtype),this.configurationAdapter)
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
            callback(undefined);
    }
}