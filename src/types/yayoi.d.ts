declare namespace Yayoi {
    export type DatabaseManagerConfig = {
        driver: 'sqlite'
        database: string
        prefix?: string
        mode?:number
    }&{
        [key in string]?:any
    }
    export=Yayoi
}