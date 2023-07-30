import { AxiosRequestConfig } from "axios";
import { Router } from "../model/data/router-server/router";
import { NoteCollab, NotePrivate } from "../model/model";
import { FilterGroup, FilterMember, Single } from "../model/model-side";
import { AuthTokenHandlerImpl } from "./auth_handler/auth-token";
import { ConnectionAxios } from "./adapter";
import { bearer_name } from "../model/resource";
import { Connection, NoteAdapterInterface } from "../usecase/adapter";

export class NoteAdapter implements NoteAdapterInterface {
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

    async getSearch(param: typeof this.route.note.SEARCH.params, callback: (data: NotePrivate[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.SEARCH.set({name:param!.name,page:param!.page,size:param!.size}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as NotePrivate[])
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

    async getSearchGroup(param: typeof this.route.note.SEARCH_GROUP.params, callback: (data: NoteCollab[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            let route = this.route.note.SEARCH_GROUP.set({group:param!.group,name:param!.name,page:param!.page,size:param!.size})
            const {data} = await this.createConnection().getConnection(route,this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as NoteCollab[])
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

    async getCategoryMember(callback: (data: Single<string>[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.CATEGORY_MEMBER,this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as Single<string>[])
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

    async getSubtypeGroup(param: typeof this.route.note.SUBTYPE_NOTE.params, callback: (data: NoteCollab[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void> {
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.SUBTYPE_NOTE.set({"group":param!.group,"subtype":param!.subtype}),this.configurationAdapter(),toLogin)
            if (data) 
                callback(data as NoteCollab[])
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

    async getSeveritiesMember(callback: (data: Single<string>[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route: number) => void): Promise<void> {
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.SEVERITIES_MEMBER,this.configurationAdapter(), toLogin)
            if (data) 
                callback(data as Single<string>[])
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
    
    async getSeveritiesGroup(param: typeof this.route.note.SEVERITIES_GROUP.params, callback: (data: Single<string>[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route: number) => void): Promise<void> {
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.SEVERITIES_GROUP.set({group:param!.group}),this.configurationAdapter(), toLogin)
            if (data) 
                callback(data as Single<string>[])
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

    async getFilter(body: FilterMember, callback: (data: NotePrivate[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(
                this.route.note.FILTER_MEMBER.addBody(JSON.stringify(body)),
                {...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'application/json'}},toLogin)
            if (data) 
                callback(data as NotePrivate[])
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

    async getFilterGroup(body: FilterGroup, callback: (data: NoteCollab[]) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(
                this.route.note.FILTER_GROUP.addBody(JSON.stringify(body)),
                {...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'application/json'}},toLogin)
            if (data) 
                callback(data as NoteCollab[])
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

    async saveNotePrivate(body: NotePrivate, callback: (data?: NotePrivate | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.SAVE_NPRIVATE
                .addBody(JSON.stringify(body)),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'application/json'}}, toLogin)
            if (data)
                callback(data as NotePrivate)
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
    
    async saveNoteGroup(param: typeof this.route.note.SAVE_NGROUP.params, body: NoteCollab, callback: (data?: NoteCollab | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.SAVE_NGROUP.set({group:param!.group})
                .addBody(JSON.stringify(body)),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'application/json'}}, toLogin)
            if (data) 
                callback(data as NoteCollab)
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

    async modifyNotePrivate(body: NotePrivate, callback: (data?: NotePrivate | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.MODIFY_NPRIVATE
                .addBody(JSON.stringify(body)),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'application/json'}}, toLogin)
            if (data) 
                callback(data as NotePrivate)
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

    async modifyNoteGroup(param: typeof this.route.note.MODIFY_NGROUP.params, body: NoteCollab, callback: (data?: NoteCollab | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.MODIFY_NGROUP.set({group:param!.group})
                .addBody(JSON.stringify(body)),{...this.configurationAdapter(), headers: {...this.configurationAdapter().headers, 'Content-Type': 'application/json'}}, toLogin)
            if (data) 
                callback(data as NoteCollab)
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

    async deleteNotePrivate(param: typeof this.route.note.DELETE_NPRIVATE.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.DELETE_NPRIVATE.set({note:param!.note}),this.configurationAdapter(),toLogin)
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
    
    async deleteNoteGroup(param: typeof this.route.note.DELETE_NGROUP.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route:number) => void): Promise<void> { 
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.DELETE_NGROUP.set({group:param!.group,note:param!.note}),this.configurationAdapter(),toLogin)
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

    async deleteNotePrivateCategory(param: typeof this.route.note.DELETE_NPRIVATE_CATEGORY.params, callback: (data?: Single<boolean> | undefined) => void, error: (errorMsg?: string | undefined) => void, toLogin: (route: number) => void): Promise<void> {
        try {
            const {data} = await this.createConnection().getConnection(this.route.note.DELETE_NPRIVATE_CATEGORY.set({category:param!.category}),this.configurationAdapter(),toLogin)
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