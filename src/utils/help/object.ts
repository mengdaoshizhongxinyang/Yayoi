export namespace ObjectHelp{
  export function pull<T extends Record<string,any>,K extends string>(obj:T,key:K){
    let a=obj[key]
    del(obj,key)
    return a
  }

  export function del<T extends any,K extends keyof T>(obj:T,key:K){
    delete obj[key]
  }
}
