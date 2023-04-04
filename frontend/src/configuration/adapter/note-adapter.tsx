import { AxiosRequestConfig } from "axios";
import { Router } from "../../data/router-server/router";
import { NoteCollab, NotePrivate } from "../../model/model";
import { Single } from "../../model/model-side";
import { AuthTokenHandlerImpl } from "../auth_handler/auth-token";
import { Adapter, Connection, ConnectionAxios } from "./adapter";

interface NoteAdapterInterface extends Adapter{
    getSearch(param: any, callback: (data: NotePrivate[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getSearchGroup(param: any, callback: (data: NoteCollab[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getFilter(param: any, callback: (data: NotePrivate[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    getFilterGroup(param: any, callback: (data: NoteCollab[]) => void, error: (errorMsg?: string) => void): Promise<void>;
    saveNotePrivate(body: NotePrivate, callback: (data?: NotePrivate) => void, error: (errorMsg?: string) => void): Promise<void>;
    saveNoteGroup(param: any, body: NoteCollab, callback: (data?: NoteCollab) => void, error: (errorMsg?: string) => void): Promise<void>;
    modifyNotePrivate(body: NotePrivate, callback: (data?: NotePrivate) => void, error: (errorMsg?: string) => void): Promise<void>;
    modifyNoteGroup(param: any, body: NoteCollab, callback: (data?: NoteCollab) => void, error: (errorMsg?: string) => void): Promise<void>;
    deleteNotePrivate(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
    deleteNoteGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void): Promise<void>;
}

export class NoteAdapter implements NoteAdapterInterface {
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


    async getSearch(param: typeof this.route.note.SEARCH.params, callback: (data: NotePrivate[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.note.SEARCH.set("name",param?.name)
            .set("page",param?.page).set("size",param?.size),this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as NotePrivate[])
        else
            callback([]);
    }

    async getSearchGroup(param: typeof this.route.note.SEARCH_GROUP.params, callback: (data: NoteCollab[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        let route = this.route.note.SEARCH_GROUP.set("group",param?.group).set("name",param?.name)
            .set("page",param?.page).set("size",param?.size)
        if (param?.member) {
            route.set("member",param.member)
        }
        const {data} = await this.createConnection().getConnection(route,this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as NoteCollab[])
        else
            callback([]);
    }

    async getFilter(param: typeof this.route.note.FILTER_MEMBER.params, callback: (data: NotePrivate[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        let route = this.route.note.FILTER_MEMBER.set("page",param?.page).set("size",param?.size)
        if (param?.categories) {
            route.set("categories",param.categories)
        }
        if (param?.severities) {
            route.set("severities",param.severities)
        }
        const {data} = await this.createConnection().getConnection(route,this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as NotePrivate[])
        else
            callback([]);
    }

    async getFilterGroup(param: typeof this.route.note.FILTER_GROUP.params, callback: (data: NoteCollab[]) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        let route = this.route.note.FILTER_GROUP.set("group",param?.group).set("page",param?.page).set("size",param?.size)
        if (param?.member) {
            route.set("member",param.member)
        }
        if (param?.severities) {
            route.set("severities",param.severities)
        }
        if (param?.subtypes) {
            route.set("subtypes",param.subtypes)
        }
        const {data} = await this.createConnection().getConnection(route,this.configurationAdapter)
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as NoteCollab[])
        else
            callback([]);
    }

    async saveNotePrivate(body: NotePrivate, callback: (data?: NotePrivate | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.note.SAVE_NPRIVATE
            .addBody(JSON.stringify(body)),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'application/json'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as NotePrivate)
        else
            callback(undefined);
    }
    
    async saveNoteGroup(param: typeof this.route.note.SAVE_NGROUP.params, body: NoteCollab, callback: (data?: NoteCollab | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.note.SAVE_NGROUP.set("group",param?.group)
            .addBody(JSON.stringify(body)),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'application/json'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as NoteCollab)
        else
            callback(undefined);
    }

    async modifyNotePrivate(body: NotePrivate, callback: (data?: NotePrivate | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.note.MODIFY_NPRIVATE
            .addBody(JSON.stringify(body)),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'application/json'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as NotePrivate)
        else
            callback(undefined);
    }

    async modifyNoteGroup(param: typeof this.route.note.MODIFY_NGROUP.params, body: NoteCollab, callback: (data?: NoteCollab | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.note.MODIFY_NGROUP.set("group",param?.group)
            .addBody(JSON.stringify(body)),{...this.configurationAdapter, headers: {...this.configurationAdapter.headers, 'Content-Type': 'application/json'}})
            .catch(err => {
                if (err.response) {
                    error(err.response.data)
                } else {
                    error(err.message)
                }
            })
        if (data) 
            callback(data as NoteCollab)
        else
            callback(undefined);
    }

    async deleteNotePrivate(param: typeof this.route.note.DELETE_NPRIVATE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.note.DELETE_NPRIVATE.set("note",param?.note),this.configurationAdapter)
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
    
    async deleteNoteGroup(param: typeof this.route.note.DELETE_NGROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void): Promise<void> {
        const {data} = await this.createConnection().getConnection(this.route.note.DELETE_NGROUP.set("group",param?.group)
            .set("note",param?.note),this.configurationAdapter)
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