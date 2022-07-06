/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2022-02-28 16:33:56
 * @Description: 
 */
import { Connection } from "./Connection";
import { SqliteGrammer as QueryGrammer } from "./query/grammars/SqliteGrammer";
import { SqliteGrammer as SchemaGrammar } from "./schema/grammers/SqliteGrammer";
import { Database, sqlite3 } from "sqlite3";
import { isNull } from "lodash";
import { SqliteBuilder } from "./schema/SqliteBuilder";
export class SqliteConnection extends Connection {
    /**
     * Create a new database connection instance.
     */
    constructor(database = '', tablePrefix = '', config: Record<string, any> = {}) {
        super(Database, database, tablePrefix, config)
    }

    protected getDefaultQueryGrammar() {
        return this.withTablePrefix(new QueryGrammer);
    }

    protected getDefaultSchemaGrammar() {
        return this.withTablePrefix(new SchemaGrammar);
    }

    public getSchemaBuilder(): SqliteBuilder {
        if (isNull(this.schemaGrammar)) {
            this.useDefaultSchemaGrammar();
        }

        return new SqliteBuilder(this);
    }
}