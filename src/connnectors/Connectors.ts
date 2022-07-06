import { trait } from "../utils/trait";
import { DetectsLostConnections } from "../DetectsLostConnections";
import "../types/yayoi";
export class Connector extends trait(class {},[DetectsLostConnections]){
    createConnection(dsn:string,config:Yayoi.DatabaseManagerConfig,options:object){
        try{
            this.tryCreateConnection(dsn,config,options)
        }catch(e){
            return 
        }
    }
    protected tryCreateConnection(dsn:string,config:Yayoi.DatabaseManagerConfig,options:object){
        
    }
    protected tryAgainIfCausedByLostConnection(dsn:string,config:Yayoi.DatabaseManagerConfig,options:object,e:Error){
        if(this.causedByLostConnection(e)){
            return this.tryCreateConnection(dsn,config,options)
        }
        throw e
    }
}