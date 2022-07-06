import { Container } from "../container/Container";
import { ConnectorFactory } from "../connnectors/ConnectorFactory";
import { DatabaseManager } from "../DatabaseManager";
import { CapsuleManagerTrait } from "../utils/traits/CapsuleManagerTrait";
import { trait } from "../utils/trait";
import { Connection } from "../Connection";
export class Capsule {
    constructor(container: (Container | null) = null) {
        this.setupContainer(container || new Container())
        this.setupDefaultConfiguration();
        this.setupManager();
        
    }

    protected container!: Container

    protected manager!: DatabaseManager;
    protected setupContainer(container: Container) {
        this.container = container
        // this.container = container;

        // if (!this.container.bound('config')) {
        //     this.container.instance('config', new Fluent);
        // }
    }

    setupDefaultConfiguration() {
        this.container.config['database.default'] = 'default'
    }


    addConnection(config: Yayoi.DatabaseManagerConfig, name = 'default') {
        let connections = this.container['config']['database.connections'];

        connections[name] = config;

        this.container['config']['database.connections'] = connections;
    }

    bootEloquent() {
        
    }

    setEventDispatcher(){

    }


    protected setupManager() {
        const factory = new ConnectorFactory(this.container)
        this.manager = new DatabaseManager(this.container, factory)
    }

    public static connection(connection: string | null = null) {
        return Capsule.instance.getConnection(connection);
    }

    public connection(connection: string|null=null) {
        return Capsule.instance.getConnection(connection);
    }

    public static schema(connection:string|null = null) {
        return Capsule.instance.connection(connection).getSchemaBuilder()
    }

    protected static instance: InstanceType<typeof this>

    setAsGlobal() {
        Capsule.instance = this
    }

    getConnection(name: string | null = null) {
        return this.manager.connection(name);
    }
}