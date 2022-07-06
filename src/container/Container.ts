export class Container {
    config: Record<string, any>
    protected static instance: object
    constructor() {
        this.config = new Proxy({} as Record<string, any>, {
            get(t, p: string) {
                let target = t
                const keyList = p.split('.')
                keyList.forEach(key => {
                    if (!target[key]) {
                        target[key] = {}
                    }
                    target = target[key]
                })
                return target
            },
            set(t, p, v) {
                if (typeof p == 'symbol') {
                    return false
                }
                let target = t
                const keyList = p.split('.')
                keyList.forEach((key,index) => {
                    if (!target[key]) {
                        target[key] = {}
                    }
                    if(index==keyList.length-1){
                        target[key]=v
                    }
                    target = target[key]
                })
                return true
            }
        })
    }
    // instance(abstract:string, instance)
    // {
    //     this.removeAbstractAlias(abstract);

    //     isBound = this.bound(abstract);

    //     unset(this.aliases[abstract]);

    //     this->instances[abstract] = instance;

    //     if (isBound) {
    //         this->rebound(abstract);
    //     }

    //     return instance;
    // }
    // bound(abstract:string){
    //     return this.bindings[abstract] ||
    //            isset($this->instances[abstract]) ||
    //            $this->isAlias($abstract);
    // }
}