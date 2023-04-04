import { NotePrivate, Subtype, Model, NoteCollab } from "../../model/model";
import { server } from "../resource/resource";

export enum HttpRequest {
    POST,
    GET,
    PUT,
    DELETE
}

export class RouterObject <T extends {}> {
    constructor(url: string, method: HttpRequest, body?: any) {
        this.url = url
        this.method = method
        this.body =body;
    }
    url: string
    params?: T
    method: HttpRequest
    body?: FormData | Model

    set<K extends keyof T>(key: K , value?: T[K]): RouterObject<T> {
        if (value) {
            this.params![key] = value
        }
        return this
    }

    getBody() {
        return this.body
    }

    addBody(data: any): RouterObject<T> {
        this.body = data
        return this
    }

    build(): string {
        if (this.params) {
            return this.url+"?"+Array.from(Object.keys(this.params)).map(key => {
                let value = this.params?[key]:undefined
                if (typeof value == 'object')
                    return (value as Array<any>).map(val => `${key}=${val}`).join('&')
                else if (typeof value != 'undefined' && typeof value != 'object')
                    return `${key}=${value}`
                else
                    return null
            }).join('&')
        } else
            return this.url
    }
}

export interface UrlBase {
    readonly url: string
}

class PublicUrl implements UrlBase {
    readonly url = server+"/public";
    readonly SUBTYPE: RouterObject<{name:string,group:string,page:number,size:number}> = new RouterObject(this.url+"/subtype", HttpRequest.GET)
    readonly SUBTYPE_SEARCH: RouterObject<{name:string,page:number,size:number}> = new RouterObject(this.url+"/subtype/search", HttpRequest.GET) 
    readonly GROUP_AVATAR: RouterObject<{name:string}> = new RouterObject(this.url+"/group/avatar", HttpRequest.GET)
    readonly THEME_IMAGE: RouterObject<{name:string}> = new RouterObject(this.url+"/theme/image", HttpRequest.GET)
    readonly MEMBER_AVATAR: RouterObject<{name:string}> = new RouterObject(this.url+"/member/avatar", HttpRequest.GET)
    readonly SIGNIN: RouterObject<{}> = new RouterObject(this.url+"/signup", HttpRequest.POST, new FormData())
    readonly LOGIN: RouterObject<{username:string,password:string}> = new RouterObject(this.url+"/login", HttpRequest.POST)
    readonly REFRESH: RouterObject<{}> = new RouterObject(this.url+"/refresh", HttpRequest.POST)
}

class AuthenticateUrl implements UrlBase{
    constructor(base: string) {
        this.url = server+"/user"+base
    }
    readonly url: string;
}

class MemberUrl extends AuthenticateUrl {
    constructor() {
        super("/member")
    }
    readonly PROFILE: RouterObject<{}> = new RouterObject(this.url, HttpRequest.GET)
    readonly SEARCH: RouterObject<{name:string,page:number,size:number}> = new RouterObject(this.url+"/search", HttpRequest.GET) 
    readonly SEARCH_DATA: RouterObject<{name:string,page:number,size:number}> = new RouterObject(this.url+"/search/data", HttpRequest.GET)
    readonly VALIDATE: RouterObject<{name:string}> = new RouterObject(this.url+"/validate", HttpRequest.GET, ["name"])
    readonly NOTIF_WAIT_GROUP: RouterObject<{page:number,size:number}> = new RouterObject(this.url+"/request", HttpRequest.GET)
    readonly NOTIF_REJECT_GROUP: RouterObject<{page:number,size:number}> = new RouterObject(this.url+"/request/reject", HttpRequest.GET)
    readonly GROUPS: RouterObject<{page:number,size:number}> = new RouterObject(this.url+"/groups", HttpRequest.GET)
    readonly LOGOUT: RouterObject<{}> = new RouterObject(this.url+"/logout", HttpRequest.POST)
    readonly POST_SEND_GROUP: RouterObject<{group:string}> = new RouterObject(this.url+"/request", HttpRequest.POST)
    readonly POST_REJECT_GROUP: RouterObject<{group:string}> = new RouterObject(this.url+"/request/reject", HttpRequest.POST)
    readonly POST_CONFIRM_GROUP: RouterObject<{group:string}> = new RouterObject(this.url+"/request/confirm", HttpRequest.POST)
    readonly MODIFY: RouterObject<{}> = new RouterObject(this.url, HttpRequest.PUT, new FormData())
    readonly MODIFY_PASSWORD: RouterObject<{newPassword:string,oldPassword:string}> = new RouterObject(this.url+"/password", HttpRequest.PUT)
    readonly DELETE_GROUP: RouterObject<{group:string}> = new RouterObject(this.url+"/rel", HttpRequest.DELETE)
}

export class GroupUrl extends AuthenticateUrl {
    constructor() {
        super("/group")
    }
    readonly SEARCH: RouterObject<{name:string,page:number,size:number}> = new RouterObject(this.url+"/search", HttpRequest.GET) 
    readonly SEARCH_DATA: RouterObject<{name:string,page:number,size:number}> = new RouterObject(this.url+"/search/data", HttpRequest.GET)
    readonly VALIDATE: RouterObject<{name:string}> = new RouterObject(this.url+"/validate", HttpRequest.GET, ["name"])
    readonly NOTIF_CONFIRM_MEMBER: RouterObject<{group:string,page:number,size:number}> = new RouterObject(this.url+"/request", HttpRequest.GET)
    readonly NOTIF_REJECT_MEMBER: RouterObject<{group:string,page:number,size:number}> = new RouterObject(this.url+"/request/reject", HttpRequest.GET)
    readonly MEMBERS_GROUP: RouterObject<{group:string,page:number,size:number}> = new RouterObject(this.url+"/members", HttpRequest.GET)
    readonly SAVE: RouterObject<{}> = new RouterObject(this.url, HttpRequest.POST,new FormData())
    readonly POST_SEND_MEMBER: RouterObject<{member:string,group:string}> = new RouterObject(this.url+"/request", HttpRequest.POST)
    readonly POST_REJECT_MEMBER: RouterObject<{member:string,group:string}> = new RouterObject(this.url+"/request/reject", HttpRequest.POST)
    readonly POST_CONFIRM_MEMBER: RouterObject<{member:string,group:string}> = new RouterObject(this.url+"/request/confirm", HttpRequest.POST)
    readonly MODIFY: RouterObject<{}> = new RouterObject(this.url, HttpRequest.PUT, new FormData())
    readonly MODIFY_PASSWORD: RouterObject<{group:string,newPassword:string,oldPassword:string}> = new RouterObject(this.url+"/password", HttpRequest.PUT)
    readonly ROLE_PROMOTE: RouterObject<{member:string,group:string}> = new RouterObject(this.url+"/role/promoted", HttpRequest.PUT)
    readonly ROLE_DEMOTE: RouterObject<{member:string,group:string}> = new RouterObject(this.url+"/role/demoted", HttpRequest.PUT)
    readonly DELETE: RouterObject<{group:string}> = new RouterObject(this.url, HttpRequest.DELETE)
    readonly DELETE_MEMBER: RouterObject<{member:string,group:string}> = new RouterObject(this.url+"/member/remove", HttpRequest.DELETE)
}

class ThemeUrl extends AuthenticateUrl {
    constructor() {
        super("/theme")
    }
    readonly SEARCH: RouterObject<{name:string,page:number,size:number}> = new RouterObject(this.url+"/search", HttpRequest.GET) 
    readonly SEARCH_DATA: RouterObject<{name:string,page:number,size:number}> = new RouterObject(this.url+"/search/data", HttpRequest.GET)
    readonly MEMBER_SEARCH: RouterObject<{name:string,page:number,size:number}> = new RouterObject(this.url+"/member/search", HttpRequest.GET) 
    readonly MEMBER_SEARCH_DATA: RouterObject<{name:string,page:number,size:number}> = new RouterObject(this.url+"/member/search/data", HttpRequest.GET)
    readonly VALIDATE: RouterObject<{name:string}> = new RouterObject(this.url+"/validate", HttpRequest.GET)
    readonly SAVE: RouterObject<{}> = new RouterObject(this.url, HttpRequest.POST, new FormData())
    readonly ADD_THEME_MEMBER: RouterObject<{theme:string}> = new RouterObject(this.url+"/rel", HttpRequest.POST)
    readonly MODIFY: RouterObject<{}> = new RouterObject(this.url, HttpRequest.PUT, new FormData()) 
    readonly DELETE: RouterObject<{theme:string}> = new RouterObject(this.url, HttpRequest.DELETE)
    readonly DELETE_MEMBER: RouterObject<{theme:string}> = new RouterObject(this.url+"/rel", HttpRequest.DELETE)
}

class SubtypeUrl extends AuthenticateUrl {
    constructor() {
        super("/subtype")
    }
    readonly ADD_GROUP: RouterObject<{subtype:string,group:string}> = new RouterObject(this.url+"/rel", HttpRequest.POST)
    readonly SAVE: RouterObject<{group:string}> = new RouterObject(this.url, HttpRequest.POST, {} as Subtype)
    readonly MODIFY: RouterObject<{group:string}> = new RouterObject(this.url, HttpRequest.PUT, {} as Subtype) 
    readonly DELETE_GROUP: RouterObject<{subtype:string,group:string}> = new RouterObject(this.url+"/rel", HttpRequest.DELETE)
}

class NoteUrl extends AuthenticateUrl {
    constructor() {
        super("/note")
    }
    readonly SEARCH: RouterObject<{name:string,page:number,size:number}> = new RouterObject(this.url+"/search", HttpRequest.GET) 
    readonly FILTER_MEMBER: RouterObject<{categories?:string[],severities?:string[],page:number,size:number}> = new RouterObject(this.url+"/filter", HttpRequest.GET)
    readonly SEARCH_GROUP: RouterObject<{group:string,member?:string,name:string,page:number,size:number}> = new RouterObject(this.url+"/search/group", HttpRequest.GET)
    readonly FILTER_GROUP: RouterObject<{subtypes?:string[],severities?:string[],group:string,member?:string,page:number,size:number}> = new RouterObject(this.url+"/group/filter", HttpRequest.GET)
    readonly SAVE_NPRIVATE: RouterObject<{}> = new RouterObject(this.url, HttpRequest.POST,{} as NotePrivate)
    readonly SAVE_NGROUP: RouterObject<{group:string}> = new RouterObject(this.url+"/group", HttpRequest.POST,{} as NoteCollab)
    readonly MODIFY_NPRIVATE: RouterObject<{}> = new RouterObject(this.url, HttpRequest.PUT,{} as NotePrivate)
    readonly MODIFY_NGROUP: RouterObject<{group:string}> = new RouterObject(this.url+"/group", HttpRequest.PUT,{} as NoteCollab)
    readonly DELETE_NPRIVATE: RouterObject<{note:string}> = new RouterObject(this.url, HttpRequest.DELETE)
    readonly DELETE_NGROUP: RouterObject<{note:string,group:string}> = new RouterObject(this.url+"/group", HttpRequest.DELETE)
}

export class Router {
    constructor() 
    {
        this.public = Router.Public
        this.member = Router.Member
        this.group = Router.Group
        this.theme = Router.Theme
        this.subtype = Router.Subtype
        this.note = Router.Note
    }
    public: PublicUrl
    member: MemberUrl
    group: GroupUrl
    theme: ThemeUrl
    subtype: SubtypeUrl
    note: NoteUrl
}

export namespace Router {
    export const Public = new PublicUrl() 
    export const Member = new MemberUrl()
    export const Group = new GroupUrl()
    export const Theme = new ThemeUrl()
    export const Subtype = new SubtypeUrl()
    export const Note = new NoteUrl()
}