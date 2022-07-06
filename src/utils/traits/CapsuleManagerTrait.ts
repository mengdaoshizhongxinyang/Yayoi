
export class CapsuleManagerTrait{
    protected static instance:InstanceType<typeof this>

    setAsGlobal(){
        CapsuleManagerTrait.instance=this
    }

}
