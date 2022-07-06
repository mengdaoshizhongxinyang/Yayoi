import { Connection } from "../../Connection";
import { Grammar as BaseGrammar } from "../../Grammar";
import { Blueprint } from "../Blueprint";
export abstract class Grammar extends BaseGrammar{
    protected transactions=false

    abstract compileTableExists():string

    compileRenameColumn(blueprint:Blueprint,connection:Connection){

    }
}
