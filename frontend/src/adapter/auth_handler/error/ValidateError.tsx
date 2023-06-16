import { ErrorResponse } from "@remix-run/router";

export default class ValidateError extends ErrorResponse {
    constructor(status: number, statusText: string, msg: string) {
        super(status,statusText,msg);
    }
}