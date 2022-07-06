export function isKey(key:string,target:Record<string,any>):key is keyof typeof target{
    if(target[key]){
        return true
    }
    return false
}

export function isFunction(value:unknown):value is Function{
    if(typeof value==='function'){
        return true
    }
    return false
}