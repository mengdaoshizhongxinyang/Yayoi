import { trait } from "../utils/trait";
import { isKey } from "../utils/is";
import { addPrototype } from "../utils/magic";
import { HasRelationships } from "./concerns/HasRelationships";
import { GuardsAttributes } from "./concerns/GuardsAttributes";
import { Builder } from "./Builder";
import { isFunction } from "lodash";

export function Model<T extends Record<string, unknown> = {}>() {
    interface MM{
        new ():(M & Builder)
    }
    abstract class M extends trait(class { }, [HasRelationships,GuardsAttributes]) {
        protected connection: string = ""

        protected primaryKey="id"

        constructor(attributes?: Partial<T>) {
            super()
            this.fill(attributes || {})
        }

        public fill(attributes: Partial<T>) {
            
        }

        getConnectionName(){
            return this.connection
        }

        setConnection(name:string){
            this.connection=name
            return this
        }
        getKeyName(): string {
            return this.primaryKey
        }
        increment(){

        }
        decrement(){

        }
        
    }
    Object.entries(Builder.prototype).forEach(([key,value])=>{
        addPrototype(M,key,value)
    })
    return M as unknown as MM & {[key in keyof Builder]:Builder[key]}
}
class B extends Model<any>(){}
export type ModelType=InstanceType<typeof B>
class A extends Model<{}>(){
    
}