import { Router } from "../model/data/router-server/router";
import axios, { AxiosResponse } from "axios";
import { AuthTokenHandlerImpl } from "./auth_handler/auth-token";
import { PublicAdapter } from "./public-adapter";
import { MemberAdapter } from "./member-adapter";
import { GroupAdapter } from "./group-adapter";
import { ThemeAdapter } from "./theme-adapter";
import { SubtypeAdapter } from "./subtype-adapter";
import { NoteAdapter } from "./note-adapter";
import { bearer_name } from "../model/resource";
import { Connection } from "../usecase/adapter";

export class ConnectionAxios extends Connection {
    protected async get(url: string, config: any, toLogin: (route:number) => void): Promise<AxiosResponse<any, any>> {
        return this.auth.validate(axios.get(url,config))
            .then(async(response) => {
                if (typeof response === 'boolean') {
                    if (response)
                        try {
                            return await axios.get(url,{...config,headers:{...config.headers,'Authorization': `${bearer_name} ${this.auth.get() ? this.auth.get() : ""}`}})
                        } catch(err:any) {
                            if(err.response && err.response.status !== 417) {
                                throw err
                            } else {
                                return {data:undefined}
                            }
                        }
                } else if(typeof response === 'number') {
                        toLogin(response)
                        return {data: null} as AxiosResponse<any, any>
                } else
                    return response
                throw new Error("token is outdate, please login again")
            });
    }
    protected async post(url: string, data: any, config: any, toLogin: (route:number) => void): Promise<AxiosResponse<any, any>> {
        return this.auth.validate(axios.post(url,data,config)).then(async(response) => {
            if (typeof response == 'boolean') {
                if (response)
                    try {
                        return await axios.post(url,data,{...config,headers:{...config.headers,'Authorization': `${bearer_name} ${this.auth.get() ? this.auth.get() : ""}`}})
                    } catch(err:any) {
                        if(err.response && err.response.status !== 417) {
                            throw err
                        } else {
                            throw new Error("please try again")
                        }
                    }
            } else if(typeof response === 'number') {
                toLogin(response)
                return {data: null} as AxiosResponse<any, any>
            } else
                return response
            throw new Error("token is outdate, please login again");
        })
    }
    protected async put(url: string, data: any, config: any, toLogin: (route:number) => void): Promise<AxiosResponse<any, any>> {
        return this.auth.validate(axios.put(url,data,config)).then(async(response) => {
            if (typeof response == 'boolean') {
                if (response)
                    try {
                        return await axios.put(url,data,{...config,headers:{...config.headers,'Authorization': `${bearer_name} ${this.auth.get() ? this.auth.get() : ""}`}})
                    } catch(err:any) {
                        if(err.response && err.response.status !== 417) {
                            throw err
                        } else {
                            throw new Error("please try again")
                        }
                    }
            } else if(typeof response === 'number') {
                toLogin(response)
                return {data: null} as AxiosResponse<any, any>
            } else
                return response
            throw new Error("token is outdate, please login again");
        });
    }
    protected async delete(url: string, config: any, toLogin: (route:number) => void): Promise<AxiosResponse<any, any>> {
        return this.auth.validate(axios.delete(url,config)).then(async(response) => {
            if (typeof response == 'boolean') {
                if (response)
                    try {
                        return await axios.delete(url,{...config,headers:{...config.headers,'Authorization': `${bearer_name} ${this.auth.get() ? this.auth.get() : ""}`}})
                    } catch(err:any) {
                        if(err.response && err.response.status !== 417) {
                            throw err
                        } else {
                            throw new Error("please try again")
                        }
                    }
            } else if(typeof response === 'number') {
                toLogin(response)
                return {data: null} as AxiosResponse<any, any>
            } else
                return response
            throw new Error("token is outdate, please login again");
        });
    }
}

export class MainAdapter {
    refresh: AuthTokenHandlerImpl = new AuthTokenHandlerImpl(Router.Public.REFRESH.url,417)
    constructor() {
        this.publicAdapter = MainAdapter.PUBLIC(this.refresh)
        this.memberAdapter = MainAdapter.MEMBER(this.refresh)
        this.groupAdapter = MainAdapter.GROUP(this.refresh)
        this.themeAdapter = MainAdapter.THEME(this.refresh)
        this.subtypeAdapter = MainAdapter.SUBTYPE(this.refresh)
        this.noteAdapter = MainAdapter.NOTE(this.refresh)
    }
    publicAdapter: PublicAdapter
    memberAdapter: MemberAdapter
    groupAdapter: GroupAdapter
    themeAdapter: ThemeAdapter
    subtypeAdapter: SubtypeAdapter
    noteAdapter: NoteAdapter
}

export namespace MainAdapter {
    export const PUBLIC = (data: AuthTokenHandlerImpl) => new PublicAdapter(data)
    export const MEMBER = (data: AuthTokenHandlerImpl) => new MemberAdapter(data)
    export const GROUP = (data: AuthTokenHandlerImpl) => new GroupAdapter(data)
    export const THEME = (data: AuthTokenHandlerImpl) => new ThemeAdapter(data)
    export const SUBTYPE = (data: AuthTokenHandlerImpl) => new SubtypeAdapter(data)
    export const NOTE = (data: AuthTokenHandlerImpl) => new NoteAdapter(data)
}