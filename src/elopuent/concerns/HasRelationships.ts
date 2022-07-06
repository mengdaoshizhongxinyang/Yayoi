// import { Relation } from "../relations/Relation"
import { HasOne } from "../relations/HasOne";
import { ModelType } from "../Model";
import { tap } from "lodash";

export abstract class HasRelationships {
  protected relations = []
  protected touches = []
  public static manyMethods = [
    'belongsToMany', 'morphToMany', 'morphedByMany',
    'guessBelongsToManyRelation', 'findFirstMethodThatIsntRelation'
  ] as const

  abstract getKeyName(): string

  abstract getConnectionName(): string


  public hasOne<R extends ModelType>(related: new () => R, foreignKey?: string, localKey?: string) {

    let instance = this.newRelatedInstance(related);

    foreignKey = foreignKey || this.getForeignKey();

    localKey = localKey || this.getKeyName();

    // return new HasOne(instance->newQuery(), this, instance->getTable().'.'.foreignKey, localKey);
    return new HasOne();
  }

  getForeignKey() {
    return this.constructor.name
  }


  protected newRelatedInstance<R extends ModelType>(classes: new () => R): R {
    return tap(new classes(), (instance) => {
      if (instance.getConnectionName()) {
        instance.setConnection(this.getConnectionName())
      }
    });
  }
}


