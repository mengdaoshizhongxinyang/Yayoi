import { trait } from "./utils/trait";
import { DetectsDeadlocks } from "./DetectsDeadlocks";
import { DetectsLostConnections } from "./DetectsLostConnections";
import { Grammar } from "./Grammar";
import { Grammar as SchemaGrammar } from "./schema/grammers/Grammar";
import { SqliteGrammer } from "./schema/grammers/SqliteGrammer";
import { DB } from "./utils/DB";
import { Database, sqlite3 } from "sqlite3";
import { Builder as SchemaBuilder } from "./schema/Builder";
import { isNull } from "lodash";
export class Connection extends trait(class { }, [DetectsDeadlocks, DetectsLostConnections]) {

    protected tablePrefix: string = ''

    protected config: Record<string, any> = {}

    protected schemaGrammar!: SchemaGrammar

    protected beforeExecutingCallbacks: Function[] = []

    protected queryGrammar!: Grammar

    protected pretending!: boolean

    protected db: sqlite3['Database'] | null = null

    protected readDB: sqlite3['Database'] | null = null

    protected transactions = 0

    protected reconnector:()=>any=()=>{}

    /**
     * The type of the connection.
     */
    protected readWriteType: string | null = null;

    constructor(db: any, database = '', tablePrefix = '', config: Record<string, any> = {}) {
        super()
        this.db = db
        this.config = config
    }
    withTablePrefix<T extends Grammar>(grammar: T) {
        grammar.setTablePrefix(this.tablePrefix);
        return grammar;
    }

    getTablePrefix() {
        return ""
    }
    public getSchemaGrammar() {
        return this.schemaGrammar;
    }

    public getSchemaBuilder()
    {
        if (isNull(this.schemaGrammar)) {
            this.useDefaultSchemaGrammar();
        }

        return new SchemaBuilder(this);
    }

    public useDefaultSchemaGrammar()
    {
        this.schemaGrammar = this.getDefaultSchemaGrammar();
    }
    
    protected getDefaultSchemaGrammar(){
        return this.withTablePrefix(new SqliteGrammer())
    }

    public selectFromWriteConnection(query: string, bindings: string[] = []) {
        return this.select(query, bindings);
    }

    public select<Q extends string>(query: Q, bindings: string[] = []) {
        return this.run(query, bindings, (query, bindings) => {
            // if (this.pretending) {
            //     return [];
            // }
            // let statement = this.prepared(
            //     this.getPdoForSelect(useReadPdo).prepare(query)
            // );

            // this.bindValues(statement, this.prepareBindings(bindings));

            // statement.execute();

            // return $statement -> fetchAll();
        });
    }

    // protected prepared(statement) {
    //     statement.setFetchMode($this -> fetchMode);

    //     this.event(new StatementPrepared(
    //         $this, $statement
    //     ));

    //     return $statement;
    // }

    protected run<Q extends string, B extends string[]>(query: Q, bindings: B, callback: (query: Q, bindings: B) => any) {
        this.beforeExecutingCallbacks.forEach(beforeExecutingCallback => {
            beforeExecutingCallback(query, bindings, this)
        })

        this.reconnectIfMissingConnection();

        let start = +new Date();

        let result
        try {
            result = this.runQueryCallback(query, bindings, callback);
        } catch (e) {
            if (e instanceof Error) {
                result = this.handleQueryException(
                    e, query, bindings, callback
                );
            }
        }

        // this.logQuery(
        //     query, bindings, this.getElapsedTime(start)
        // );

        return result;
    }


    protected runQueryCallback<Q extends string, B extends string[]>(query: Q, bindings: B, callback: (query: Q, bindings: B) => any) {

        try {
            return callback(query, bindings);
        }
        catch (e) {
            throw e
            // throw new QueryException(
            //     $query, $this -> prepareBindings($bindings), $e
            // );
        }
    }

    protected handleQueryException<Q extends string, B extends string[]>(e: Error, query: Q, bindings: B, callback: (q: Q, b: B) => any) {
        if (this.transactions >= 1) {
            throw e;
        }

        return this.tryAgainIfCausedByLostConnection(
            e, query, bindings, callback
        );
    }

    protected tryAgainIfCausedByLostConnection<Q extends string, B extends string[]>(e: Error, query: Q, bindings: B, callback: (q: Q, b: B) => any) {
        if (this.causedByLostConnection(e)) {
            this.reconnect();

            return this.runQueryCallback(query, bindings, callback);
        }

        throw e;
    }
    protected reconnectIfMissingConnection() {
        if (this.db) {
            this.reconnect();
        }
    }

    public reconnect() {
        //     if (this.reconnector) {
        //         this.doctrineConnection = null;

        //         return call_user_func(this.reconnector, this);
        //     }

        //     throw new Error('Lost connection and no reconnector available.');
    }

    public getName() {
        return this.getConfig('name');
    }

    getNameWithReadWriteType() {
        return this.getName() + (this.readWriteType ? '::' + this.readWriteType : '');
    }

    getConfig(option: string | null = null) {
        return option ? this.config[option] : ""
    }

    disconnect() {
        this.setDb(null).setReadDb(null);
    }

    setDb(db: any) {

        this.transactions = 0;

        this.db = db;

        return this;

    }

    getDb() {
        return this.db;
    }

    setReadDb(db: any) {
        this.readDB = db;

        return this;
    }

    getReadDb() {
        if (this.transactions > 0) {
            return this.getDb();
        }
        // if (this.readOnWriteConnection ||
        //     (this.recordsModified && $this -> getConfig('sticky'))) {
        //     return $this -> getPdo();
        // }

        // if ($this -> readPdo instanceof Closure) {
        //     return $this -> readPdo = call_user_func($this -> readPdo);
        // }
        return this.readDB ?this.readDB: this.getDb();
    }

    setReadWriteType(readWriteType:string|null)
    {
        this.readWriteType = readWriteType;

        return this;
    }

    setReconnector(reconnector:(...args:any[])=>any)
    {
        this.reconnector = reconnector;

        return this;
    }
}