
import { Yayoi } from "../../src";

describe('Model', () => {
    const yayoi = new Yayoi()
    yayoi.addConnection({
        driver:"sqlite",
        database:"./test.db",
        name:"s"
    })
    yayoi.setAsGlobal()
    console.log(Yayoi.schema())
    Yayoi.schema().create('test',(blueprint)=>{
        blueprint
    })
    // yayoi.addConnection({
    //     driver: "sqlite",
    //     database: "./db.db"
    // })

    // yayoi.setAsGlobal()

    // Yayoi.schema()
    
    it('should render correctly', function () {
        expect(2).toEqual(2)
    })
})
