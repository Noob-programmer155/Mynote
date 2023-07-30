import { IdAndName } from "../../model-side"

export const enum ReduxRoute{
    HOME,
    SIGNIN,
    SIGNUP,
    THEME
}

export interface SearchType{
    page: number
    size: number
    endPage: boolean
}

export interface FilterType {
    categories?:string[]
    subtypes?:IdAndName<string>[]
    severities?:string[]
    member?:string
    group?:string
}