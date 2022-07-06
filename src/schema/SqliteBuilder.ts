import { Builder } from "./Builder";
import { Database } from "sqlite3";
export class SqliteBuilder extends Builder{

  
  public createDatabase(name: string) {
    new Database(name, (err) => {
      if (err !== null) {
        console.log(err)
      } 
      return this
    })
  }
}