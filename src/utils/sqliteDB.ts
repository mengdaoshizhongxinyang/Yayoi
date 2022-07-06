import sql from "sqlite3";
import { DB } from "./DB";
let sqlite:sql.sqlite3=sql.verbose()

export async function getDB() {
    let db = await (() => new Promise<sql.Database>((resolve, reject) => {
        let db = new sqlite.Database('./db.db', (err) => {
            if (err === null) {
                resolve(db)
            } else {
                reject(err)
            }
        })
    }))()
    return new SqliteDB(db)
}
type PRAGMA={
    cid:number
    dflt_value:any
    name:string
    notnull:0|1
    pk:number
    type:string
}
class SqliteDB extends DB {
    constructor(private db: sql.Database) {
        super()
     }
    run(sql: string, params: any = []) {
        return new Promise((resolve, reject) => {
            console.log(sql)
            this.db.run(sql, params, (result) => {
                if (result == null) {
                    resolve(result)
                } else {
                    reject(result)
                }
            })
        })
    }
    get<T extends Object = any>(sql: string, params: any = undefined) {
        return new Promise<T>((resolve, reject) => {
            if (params == undefined) {
                this.db.get(sql, (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            } else {
                this.db.get(sql, params, (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            }
        })
    }
    all<T extends Object = any>(sql: string, params: unknown = undefined) {
        return new Promise<T[]>((resolve, reject) => {
            if (params == undefined) {
                this.db.all(sql, (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            } else {
                this.db.all(sql, params, (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            }
        })
    }
    exec(sql:string){
        return new Promise((reslove,reject)=>{
            this.db.exec(sql,(err)=>{
                if(err==null){
                    reslove(true)
                }else{
                    reject(err)
                }
            })
        })
    }
    pragma(table:string){
        return new Promise<PRAGMA[]>((reslove,reject)=>{
            this.db.all(`PRAGMA table_info(${table})`,(err,data)=>{
                if(err==null){
                    reslove(data)
                }else{
                    reject(err)
                }
            })
        })
    }
    close() {
        this.db.close()
    }
}
export default getDB