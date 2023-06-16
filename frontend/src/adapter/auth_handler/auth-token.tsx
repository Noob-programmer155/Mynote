import axios, { AxiosResponse } from "axios";
import { TokenConverter } from "../converter/attribute";
import { token_name,bearer_name } from "../../model/data/resource/resource";
import { Single } from "../../model/model-side";
import ValidateError from "./error/ValidateError";
import { ReduxRoute } from "../../configuration/redux/redux-item-route";

export abstract class AuthTokenHandler {
    protected readonly refreshUrl: string
    protected loginUrl: string = ""
    protected readonly attributeStatusRefreshToken: number
    private readonly tokenConverter = new TokenConverter()

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
    abstract refresh(): Promise<boolean | ReduxRoute>
    protected abstract errorHandlerToken(): any
}

export class AuthTokenHandlerImpl extends AuthTokenHandler {
    async validate(stateConnection: Promise<AxiosResponse<any, any>>): Promise<AxiosResponse<any, any> | boolean | ReduxRoute> {
        try {
            return await stateConnection
        } catch(err: any) {
            if (err) {
                if (err.response.status == this.attributeStatusRefreshToken) {
                    return await this.refresh()
                }
                throw new ValidateError(403,"Validation Error",err.response.data)
            }
            throw new Error(err.message)
        }
    }

    async refresh(): Promise<boolean | ReduxRoute> {
        try {
            let {data} = await axios.post(this.refreshUrl,null,{headers: {'Authorization': `${bearer_name} ${this.get()}`}});
            if (data !== null) {
                let resObj = data as Single<string>
                if (resObj.data !== undefined) {
                    this.set(resObj.data)
                }
                return true
            } else
                return false
        } catch (err: any) {
            return this.errorHandlerToken()
        }
    }

    protected errorHandlerToken() {
        return ReduxRoute.SIGNUP;
    }
}