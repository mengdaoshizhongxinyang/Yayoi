import { includes } from "lodash";
export class DetectsLostConnections {
    protected causedByLostConnection(e: Error) {
        const msg = e.message

        return includes([
            'server has gone away',
            'no connection to the server',
            'Lost connection',
            'is dead or not enabled',
            'Error while sending',
            'decryption failed or bad record mac',
            'server closed the connection unexpectedly',
            'SSL connection has been closed unexpectedly',
            'Error writing data to the connection',
            'Resource deadlock avoided',
            'Transaction() on null',
        ], msg)
    }
}