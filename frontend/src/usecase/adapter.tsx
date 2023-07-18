import { HttpRequest, Router, RouterObject } from "../model/data/router-server/router"
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