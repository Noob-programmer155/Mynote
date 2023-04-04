export function validateString(...data:string[]) {
    for (let index = 1; index < data.length; index+2) {
        const element1 = data[index-1]
        const element2 = data[index]
        if (element1 !== element2) {
            return false
        }
    }
    return true
}