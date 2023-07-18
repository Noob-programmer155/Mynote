import axios, { AxiosResponse } from "axios";
import { bearer_name } from "../../usecase/resource";
import { Single } from "../../model/model-side";
import ValidateError from "../../model/error/ValidateError";
import { ReduxRoute } from "../../usecase/other/redux-item-route";
import { AuthTokenHandler } from "../../usecase/auth_handler/auth-token";

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