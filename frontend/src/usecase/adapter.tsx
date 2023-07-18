import { MultipartBody } from "../model/data/router-server/attachment"
import { HttpRequest, Router, RouterObject } from "../model/data/router-server/router"
import { Group, Member, NoteCollab, NotePrivate, Subtype, Theme } from "../model/model"
import { FilterGroup, FilterMember, IdAndName, Login, Password, Single } from "../model/model-side"
import { AuthTokenHandler } from "./auth_handler/auth-token"

export abstract class Connection {
    public auth: AuthTokenHandler
    constructor(auth: AuthTokenHandler) {
        this.auth = auth
    }
    async getConnection(router: RouterObject<{}>, config: {}, toLogin: (route:number) => void) {
        switch (router.method) {
            case HttpRequest.POST:
                return this.post(router.build(),router.body,config,toLogin)
            case HttpRequest.PUT:
                return this.put(router.build(),router.body,config,toLogin)
            case HttpRequest.DELETE:
                return this.delete(router.build(),config,toLogin)
            default:
                return this.get(router.build(),config,toLogin)
        }
    }
    protected abstract get(url: string, config: {},toLogin: (route:number) => void): Promise<any> 
    protected abstract post(url: string, data: any, config: {}, toLogin: (route:number) => void): Promise<any>
    protected abstract put(url: string, data: any, config: {}, toLogin: (route:number) => void): Promise<any>
    protected abstract delete(url: string, config: {}, toLogin: (route:number) => void): Promise<any>
}

export interface Adapter {
    route: Router
    auth: AuthTokenHandler
    configurationAdapter: () => any
    createConnection(): Connection
}

export interface GroupAdapterInterface extends Adapter {
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

export interface MemberAdapterInterface extends Adapter {
    getProfile(callback: (data?: Member) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSearch(param: any, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSearchData(param: any, callback: (data: Member[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getAllMemberGroup(param: any, callback: (data: Group[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getAllGroupQueue(param: any, callback: (data: Group[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getAllGroupRejected(param: any, callback: (data: Group[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    logout(callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    sendRequestGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    sendRejectGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    sendConfirmGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    modify(body: MultipartBody<Member>, callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    modifyPassword(body: Password, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    deleteGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
}

export interface NoteAdapterInterface extends Adapter{
    getSearch(param: any, callback: (data: NotePrivate[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSearchGroup(param: any, callback: (data: NoteCollab[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getCategoryMember(callback: (data: Single<string>[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSubtypeGroup(param: any, callback: (data: NoteCollab[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSeveritiesMember(callback: (data: Single<string>[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSeveritiesGroup(param: any, callback: (data: Single<string>[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getFilter(body: FilterMember,callback: (data: NotePrivate[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getFilterGroup(body: FilterGroup,callback: (data: NoteCollab[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    saveNotePrivate(body: NotePrivate, callback: (data?: NotePrivate) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    saveNoteGroup(param: any, body: NoteCollab, callback: (data?: NoteCollab) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    modifyNotePrivate(body: NotePrivate, callback: (data?: NotePrivate) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    modifyNoteGroup(param: any, body: NoteCollab, callback: (data?: NoteCollab) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    deleteNotePrivate(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    deleteNoteGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    deleteNotePrivateCategory(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
}

export interface PublicAdapterInterface extends Adapter {
    validateUserName(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSubtype(param: any, callback: (data: Subtype[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSubtypeSearch(param: any, callback: (data: Subtype[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    // getGroupAvatar(param: any, callback: (data?: string) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    // getThemeImage(param: any, callback: (data?: string) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    // getMemberAvatar(param: any, callback: (data?: string) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    signIn(body: MultipartBody<Member>, callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void):Promise<void>;
    login(body: Login, callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void):Promise<void>;
    // refresh(callback: (data?: Single<string>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void):void;
}

export interface SubtypeAdapterInterface extends Adapter {
    updateIndex(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    save(param: any,body: Subtype, callback: (data?: Subtype) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    modify(param: any,body: Subtype, callback: (data?: Subtype) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    removeGroup(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
}

export interface ThemeAdapterInterface extends Adapter {
    getSearch(param: any, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getSearchData(param: any, callback: (data: Theme[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getMemberSearch(param: any, callback: (data: IdAndName<string>[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    getMemberSearchData(param: any, callback: (data: Theme[]) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    validate(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    activateTheme(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    save(body:MultipartBody<Theme> ,callback: (data?: Theme) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    addTo(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    modify(body:MultipartBody<Theme> ,callback: (data?: Theme) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    delete(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
    removeFrom(param: any, callback: (data?: Single<boolean>) => void, error: (errorMsg?: string) => void, toLogin: (route:number) => void): Promise<void>;
}