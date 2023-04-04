
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