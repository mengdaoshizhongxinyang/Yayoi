type Constructor=(abstract new () => any) | (new ()=>any)

export function addPrototype<T extends Constructor,K extends string,V extends unknown>(target:T,key:K,value:V):asserts target is T & {[k in K]:V}{
    target.prototype[key]=value
}

export function addStatic<T extends Constructor,K extends string,V extends unknown>(target:T,key:K,value:V){
    (target as any)[key]=value
}