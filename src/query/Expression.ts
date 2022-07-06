import { toString } from "lodash";

export class Expression{


    constructor(protected value:any){}

    getValue(){
        return this.value
    }

    toString(){
        return toString(this.value)
    }
}