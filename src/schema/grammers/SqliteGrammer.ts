import { Grammar } from "./Grammar";
export class SqliteGrammer extends Grammar{
    compileTableExists(): string {
        return "select * from sqlite_master where type = 'table' and name = ?"
    }
    
}