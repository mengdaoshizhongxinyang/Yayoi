import { trait } from "../utils/trait";
import { HasRelationships } from "./concerns/HasRelationships";

export abstract class Model<T extends Record<string,unknown>={}> extends trait(class{},[HasRelationships]){
    getKeyName(): string {
        return ""
    }
    
}
