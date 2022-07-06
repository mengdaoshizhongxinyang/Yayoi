export abstract class Migration{
    protected connection:string
    getConnection(){
        return this.connection
    }
}