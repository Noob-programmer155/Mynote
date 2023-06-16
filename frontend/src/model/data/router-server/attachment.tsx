export type MultipartBody<E> = {
    image?: Blob,
    data: E
}