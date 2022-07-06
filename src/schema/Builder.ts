/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2022-02-28 10:16:39
 * @Description: 
 */
import { Grammar } from "./grammers/Grammar";
import { Connection } from "../Connection";
import { Blueprint } from "./Blueprint";


export class Builder {
    protected connection: Connection

    protected grammar: Grammar

    public static defaultStringLength = 255

    public static defaultMorphKeyType = 'int'

    constructor(connection: Connection) {
        this.connection = connection
        this.grammar = connection.getSchemaGrammar()
    }

    static setDefaultStringLength(value: number) {
        this.defaultStringLength = value
    }
    static setDefaultMorphKeyType(type: string) {
        this.defaultMorphKeyType = type
    }

    static morphUsingUuids() {
        this.setDefaultMorphKeyType('uuid')
    }

    public createDatabase(name: string) {
        throw new Error("This database driver does not support creating databases.")
    }

    public dropDatabaseIfExists(name: string) {
        throw new Error('This database driver does not support dropping databases.');
    }

    public hasTable(table:string)
    {
        table = this.connection.getTablePrefix();

        return this.connection.selectFromWriteConnection(
            this.grammar.compileTableExists(), [table]
        ).length > 0;
    }

    protected build(blueprint:Blueprint)
    {
        blueprint.build(this.connection, this.grammar);
    }

    create(table:string,callback:(blueprint:Blueprint)=>void){
        this.build
    }

}