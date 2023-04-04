import { HttpRequest, Router, RouterObject } from "../../data/router-server/router";
import axios, { AxiosResponse } from "axios";
import { AuthTokenHandler, AuthTokenHandlerImpl } from "../auth_handler/auth-token";
import { PublicAdapter } from "./public-adapter";
import { MemberAdapter } from "./member-adapter";
import { GroupAdapter } from "./group-adapter";
import { ThemeAdapter } from "./theme-adapter";
import { SubtypeAdapter } from "./subtype-adapter";
import { NoteAdapter } from "./note-adapter";
import { useAppDispatch } from "../redux/hooks";
import { setRoute } from "../redux/reducer/route-reducer";

export abstract class Connection {
    public auth: AuthTokenHandler
    public dispatch = useAppDispatch()
    constructor(auth: AuthTokenHandler) {
        this.auth = auth
    }
    async getConnection(router: RouterObject<{}>, config: {}) {
        switch (router.method) {
            case HttpRequest.POST:
                return this.post(router.build(),router.body,config)
            case HttpRequest.PUT:
                return this.put(router.build(),router.body,config)
            case HttpRequest.DELETE:
                return this.delete(router.build(),config)
            default:
                return this.get(router.build(),config)
        }
    }
    protected abstract get(url: string, config: {}): Promise<any> 
    protected abstract post(url: string, data: any, config: {}): Promise<any>
    protected abstract put(url: string, data: any, config: {}): Promise<any>
    protected abstract delete(url: string, config: {}): Promise<any>
}

export class ConnectionAxios extends Connection {
    protected async get(url: string, config: {}): Promise<AxiosResponse<any, any>> {
        return this.auth.validate(axios.get(url,config))
            .then(async(response) => {
                if (typeof response === 'boolean') {
                    if (response)
                        return await axios.get(url,config)
                } else if(typeof response === 'number') {
                        this.dispatch(setRoute(response))
                        return undefined
                } else
                    return response
                throw new Error("token is outdate, please login again")
            })
    }
    protected async post(url: string, data: any, config: {}): Promise<AxiosResponse<any, any>> {
        return this.auth.validate(axios.post(url,data,config)).then(async(response) => {
            if (typeof response == 'boolean') {
                if (response)
                    return await axios.post(url,data,config)
            } else if(typeof response === 'number') {
                this.dispatch(setRoute(response))
                return undefined
            } else
                return response
            throw new Error("token is outdate, please login again");
        });
    }
    protected async put(url: string, data: any, config: {}): Promise<AxiosResponse<any, any>> {
        return this.auth.validate(axios.put(url,data,config)).then(async(response) => {
            if (typeof response == 'boolean') {
                if (response)
                    return await axios.put(url,data,config)
            } else if(typeof response === 'number') {
                this.dispatch(setRoute(response))
                return undefined
            } else
                return response
            throw new Error("token is outdate, please login again");
        });
    }
    protected async delete(url: string, config: {}): Promise<AxiosResponse<any, any>> {
        return this.auth.validate(axios.delete(url,config)).then(async(response) => {
            if (typeof response == 'boolean') {
                if (response)
                    return await axios.delete(url,config)
            } else if(typeof response === 'number') {
                this.dispatch(setRoute(response))
                return undefined
            } else
                return response
            throw new Error("token is outdate, please login again");
        });
    }
}

export interface Adapter {
    route: Router 
    auth: AuthTokenHandlerImpl
    configurationAdapter: any;
    createConnection(): Connection
}

export class MainAdapter {
    constructor() {
        this.publicAdapter = MainAdapter.PUBLIC
        this.memberAdapter = MainAdapter.MEMBER
        this.groupAdapter = MainAdapter.GROUP
        this.themeAdapter = MainAdapter.THEME
        this.subtypeAdapter = MainAdapter.SUBTYPE
        this.noteAdapter = MainAdapter.NOTE
    }
    publicAdapter: PublicAdapter
    memberAdapter: MemberAdapter
    groupAdapter: GroupAdapter
    themeAdapter: ThemeAdapter
    subtypeAdapter: SubtypeAdapter
    noteAdapter: NoteAdapter
}

export namespace MainAdapter {
    export const PUBLIC = new PublicAdapter()
    export const MEMBER = new MemberAdapter()
    export const GROUP = new GroupAdapter()
    export const THEME = new ThemeAdapter()
    export const SUBTYPE = new SubtypeAdapter()
    export const NOTE = new NoteAdapter()
}