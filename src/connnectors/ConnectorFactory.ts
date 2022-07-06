import { Container } from "../container/Container";
import { isset } from "../utils/help";
import { SqliteConnection } from "../SqliteConnection";
export class ConnectorFactory {
    constructor(protected container: Container) { }

    make(config: Record<string, any>, name: string | null = null) {
        config = this.parseConfig(config, name || "");

        // if (isset(config['read'])) {
        //     return this.createReadWriteConnection($config);
        // }

        return this.createSingleConnection(config);
    }

    protected parseConfig(config: Record<string, any>, name: string) {
        config['prefix'] = ''
        config['name'] = name
        return config
    }

    protected createSingleConnection(config: Record<string, any>) {
        // let db = this.createPdoResolver(config);

        return this.createConnection(
            config['driver'], config['database'], config['prefix'], config
        );
    }

    protected createConnection(driver: string, database: string, $prefix = '', config: Record<string, any> = {}) {
        // if ($resolver = Connection::getResolver($driver)) {
        //     return $resolver($connection, $database, $prefix, $config);
        // }
        switch (driver) {
            case 'sqlite':
                return new SqliteConnection()
            default:
                throw new Error("error driver")
        }

    }


}