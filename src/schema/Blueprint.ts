import { Connection } from "../Connection"
import { Grammar } from "./grammers/Grammar"
import { filter } from "lodash";
import { ColumnDefinition } from "./ColumnDefinition";
export class Blueprint {
  protected table: string

  protected prefix: string

  protected columns:ColumnDefinition[]=[]

  after:string=""
  constructor(table: string, callback: ((blueprint: Blueprint) => any) | null = null, prefix = '') {
    this.table = table
    this.prefix = prefix
    if (callback !== null) {
      callback(this)
    }
  }

  build(connection:Connection,grammar:Grammar){
    
  }

  toSql(connection:Connection,grammar:Grammar){

  }
  addColumn(type:string,name:string,parameters=[]){
    return this.addColumn
  }

  protected addColumnDefinition(definition:ColumnDefinition)
  {
      this.columns.push(definition);

      if (this.after) {
          definition.after(this.after);

          this.after = definition.name;
      }

      return definition;
  }

  integet(column:string,autoIncrement=false,unsigned=false){
    
  }

  protected addImpliedCommands(grammar:Grammar){

  }
}