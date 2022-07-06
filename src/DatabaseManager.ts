/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2022-03-04 09:17:00
 * @Description: 
 */
import { Connection } from "./Connection";
import { ConnectorFactory } from "./connnectors/ConnectorFactory";
import { Container } from "./container/Container";
import { ConfigurationUrlParser } from "./utils/supprt/ConfigurationUrlParser"
import { isset } from "./utils/help"
export class DatabaseManager {

    protected connections: Record<string, Connection> = {}

    protected doctrineTypes: Record<string, any> = {};

    constructor(protected app: Container, protected factory: ConnectorFactory) {

    }

    protected reconnector(connection: Connection) {
        this.reconnect(connection.getNameWithReadWriteType());
    };

    reconnect(name: string | null = null) {
        this.disconnect(name = name ? name : this.getDefaultConnection());

        if (!isset(this.connections[name || ""])) {
            return this.connection(name);
        }

        // return this.refreshPdoConnections(name);
    }

    getDefaultConnection(): string {
        return this.app['config']['database.default'];
    }

    disconnect(name: string | null = null) {
        if (isset(this.connections[name = name ? name : this.getDefaultConnection()])) {
            this.connections[name || ""].disconnect();
        }
    }

    addConnection(config: Yayoi.DatabaseManagerConfig, name: string = "default") {

    }


    protected parseConnectionName(name: string | null) {
        name = name ? name : this.getDefaultConnection()

        return (name.endsWith('::read') || name.endsWith('::write')) ? name.split('::', 2) : [name, null]
    }

    registerDoctrineType(classes: string, name: string, type: string): void {


        this.doctrineTypes[name] = [type, classes];
    }

    protected setDbForType(connection: Connection, type: string | null = null) {
        if (type === 'read') {
            connection.setDb(connection.getReadDb());
        } else if (type === 'write') {
            connection.setReadDb(connection.getDb());
        }

        return connection;
    }

    protected registerConfiguredDoctrineTypes(connection: Connection): void {
        for (let name in (this.app['config']['database.dbal.types'] || [])) {
            this.registerDoctrineType(this.app['config']['database.dbal.types'][name], name, name)
        }

        for (let name in this.doctrineTypes) {
            this.registerDoctrineType(this.app['config']['database.dbal.types'][name], name, name)
        }
    }

    protected configure(connection: Connection, type: string) {
        connection = this.setDbForType(connection, type).setReadWriteType(type);

        // First we'll set the fetch mode and a few other dependencies of the database
        // connection. This method basically just configures and prepares it to get
        // used by the application. Once we're finished we'll return it back out.
        // if (this.app.bound('events')) {
        //     $connection->setEventDispatcher($this->app['events']);
        // }

        // if ($this->app->bound('db.transactions')) {
        //     $connection->setTransactionManager($this->app['db.transactions']);
        // }

        // Here we'll set a reconnector callback. This reconnector can be any callable
        // so we will set a Closure to reconnect from this manager with the name of
        // the connection, which will allow us to reconnect from the connections.
        connection.setReconnector(this.reconnector);

        this.registerConfiguredDoctrineTypes(connection);

        return connection;
    }

    protected configuration(name: string) {
        name = name ? name : this.getDefaultConnection();

        // To get the database connection configuration, we will just pull each of the
        // connection configurations and get the configurations for the given name.
        // If the configuration doesn't exist, we'll throw an exception and bail.
        let connections = this.app['config']['database.connections'];
        let config = connections[name]
        if (config == null ) {
            throw new Error(`Database connection ${name} not configured.`);
        }

        return new ConfigurationUrlParser().parseConfiguration(config);
    }

    protected makeConnection(name: string) {
        let config = this.configuration(name);

        // First we will check by the connection name to see if an extension has been
        // registered specifically for that connection. If it has we will call the
        // Closure and pass it the config allowing it to resolve the connection.
        // if (isset($this->extensions[$name])) {
        //     return call_user_func($this->extensions[$name], $config, $name);
        // }

        // Next we will check to see if an extension has been registered for a driver
        // and will call the Closure if so, which allows us to have a more generic
        // resolver for the drivers themselves which applies to all connections.
        // if (isset($this->extensions[$driver = $config['driver']])) {
        //     return call_user_func($this->extensions[$driver], $config, $name);
        // }

        return this.factory.make(config, name);
    }

    connection(name: string | null = null) {
        let [database, type] = this.parseConnectionName(name)
        name = name || ""
        if (!isset(this.connections[name])) {
            this.connections[name] = this.configure(
                this.makeConnection(database || ""), type || ""
            );
        }
        return this.connections[name]
    }


}
