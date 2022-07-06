import { includes } from "lodash";
export class DetectsDeadlocks{
    protected  causedByDeadlock(e:Error){
        const msg=e.message

        return includes([
            'Deadlock found when trying to get lock',
            'deadlock detected',
            'The database file is locked',
            'database is locked',
            'database table is locked',
            'A table in the database is locked',
            'has been chosen as the deadlock victim',
        ],msg)
    }
}