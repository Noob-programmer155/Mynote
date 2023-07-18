
export type Pair<K,V> = {
    first:K;
    second:V;
}

export type Single<K> = {
    data: K
}

export type IdAndName<ID> = {
    id: ID,
    name: string
}

export type Login = {
    username:string,
    password:string
}

export type Password = {
    newPassword:string,
    oldPassword:string
}

export type FilterMember = {
    categories?:string[],
    severities?:string[],
    page:number,
    size:number
}

export type FilterGroup = {
    subtypes?:string[],
    severities?:string[],
    group:string,
    member?:string,
    page:number,
    size:number
}

export const enum Role{
    MANAGER="MANAGER",
    ADMIN="ADMIN",
    MEMBER="MEMBER",
    USER="USER"
}