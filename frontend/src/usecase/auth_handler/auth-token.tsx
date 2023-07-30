import { token_name } from "../../model/resource";

export abstract class AuthTokenHandler {
    protected readonly refreshUrl: string
    protected loginUrl: string = ""
    protected readonly attributeStatusRefreshToken: number

    constructor(refreshUrl: string, attributeStatusRefreshToken: number) {
        this.refreshUrl = refreshUrl;
        this.attributeStatusRefreshToken = attributeStatusRefreshToken
    }

    setLoginUrl(url: string) {
        this.loginUrl = url
    }

    set(token: string) {
        localStorage.setItem(token_name,token)
    }

    get() {
        let token = localStorage.getItem(token_name)
        if (token && token !== null) {
            return token
        } else
            return undefined
    }

    delete() {
        localStorage.removeItem(token_name)
    }
    abstract validate(stateConnection: Promise<any>): Promise<any> 
    abstract refresh(): Promise<boolean | any>
    protected abstract errorHandlerToken(): any
}