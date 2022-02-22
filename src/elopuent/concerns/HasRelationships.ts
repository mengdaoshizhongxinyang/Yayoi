import { Relation } from "../relations/Relation"
import { HasOne } from "../relations/HasOne";
import { Model } from "../Model";
import {tap} from "lodash";

export abstract class HasRelationships {
    protected relations = []
    protected touches = []
    public static manyMethods = [
        'belongsToMany', 'morphToMany', 'morphedByMany',
        'guessBelongsToManyRelation', 'findFirstMethodThatIsntRelation'
    ] as const

    abstract getKeyName():string

    public hasOne<R extends Model>(related:new ()=>R, foreignKey?:string, localKey?:string)
    {
        let instance = this.newRelatedInstance(related);

        foreignKey = foreignKey || this.getForeignKey();

        localKey = localKey || this.getKeyName();

        // return new HasOne(instance->newQuery(), this, instance->getTable().'.'.foreignKey, localKey);
        return new HasOne();
    }
    getForeignKey(){
        return this.constructor.name
    }


    protected newRelatedInstance<R extends Model>(classes:new ()=>R)
    {
        return tap(new classes(), function (instance) {

        });
    }
}
