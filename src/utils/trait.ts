type Constructor = new (...a: any[]) => any;
type TraitConstructor =(abstract new () => any) | (new ()=>any)
type Merge<TTarget extends Constructor, TTrait extends TraitConstructor> =
    (new (...a: ConstructorParameters<TTarget>) => InstanceType<TTrait> & InstanceType<TTarget>)
    // (new (...a: ConstructorParameters<TTarget>) => InstanceType<TTrait> & InstanceType<TTarget>) & Pick<TTarget, keyof TTarget> & Pick<TTrait, keyof TTrait>


function trait<T extends Constructor, T1 extends TraitConstructor, T2 extends TraitConstructor, T3 extends TraitConstructor, T4 extends TraitConstructor, T5 extends TraitConstructor, T6 extends TraitConstructor, T7 extends TraitConstructor, T8 extends TraitConstructor, T9 extends TraitConstructor>(tgt: T, traits: readonly [T1, T2, T3, T4, T5, T6, T7, T8, T9]): Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<T, T1>, T2>, T3>, T4>, T5>, T6>, T7>, T8>, T9>
function trait<T extends Constructor, T1 extends TraitConstructor, T2 extends TraitConstructor, T3 extends TraitConstructor, T4 extends TraitConstructor, T5 extends TraitConstructor, T6 extends TraitConstructor, T7 extends TraitConstructor, T8 extends TraitConstructor>(tgt: T, traits: readonly [T1, T2, T3, T4, T5, T6, T7, T8]): Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<T, T1>, T2>, T3>, T4>, T5>, T6>, T7>, T8>
function trait<T extends Constructor, T1 extends TraitConstructor, T2 extends TraitConstructor, T3 extends TraitConstructor, T4 extends TraitConstructor, T5 extends TraitConstructor, T6 extends TraitConstructor, T7 extends TraitConstructor>(tgt: T, traits: readonly [T1, T2, T3, T4, T5, T6, T7]): Merge<Merge<Merge<Merge<Merge<Merge<Merge<T, T1>, T2>, T3>, T4>, T5>, T6>, T7>
function trait<T extends Constructor, T1 extends TraitConstructor, T2 extends TraitConstructor, T3 extends TraitConstructor, T4 extends TraitConstructor, T5 extends TraitConstructor, T6 extends TraitConstructor>(tgt: T, traits: readonly [T1, T2, T3, T4, T5, T6]): Merge<Merge<Merge<Merge<Merge<Merge<T, T1>, T2>, T3>, T4>, T5>, T6>
function trait<T extends Constructor, T1 extends TraitConstructor, T2 extends TraitConstructor, T3 extends TraitConstructor, T4 extends TraitConstructor, T5 extends TraitConstructor>(tgt: T, traits: readonly [T1, T2, T3, T4, T5]): Merge<Merge<Merge<Merge<Merge<T, T1>, T2>, T3>, T4>, T5>
function trait<T extends Constructor, T1 extends TraitConstructor, T2 extends TraitConstructor, T3 extends TraitConstructor, T4 extends TraitConstructor>(tgt: T, traits: readonly [T1, T2, T3, T4]): Merge<Merge<Merge<Merge<T, T1>, T2>, T3>, T4>
function trait<T extends Constructor, T1 extends TraitConstructor, T2 extends TraitConstructor, T3 extends TraitConstructor>(tgt: T, traits: readonly [T1, T2, T3]): Merge<Merge<Merge<T, T1>, T2>, T3>
function trait<T extends Constructor, T1 extends TraitConstructor, T2 extends TraitConstructor>(tgt: T, traits: readonly [T1, T2]): Merge<Merge<T, T1>, T2>
function trait<T extends Constructor, T1 extends TraitConstructor>(tgt: T, traits: readonly [T1]): Merge<T, T1>
function trait<T extends Constructor, P extends TraitConstructor[]>(tgt: T, traits: P) {
    traits.map(Orig => {
        let _stats =
            Object
                .getOwnPropertyNames(Orig)
                .filter(prop =>
                    prop != 'length'
                    && prop != 'prototype'
                    && prop != 'name'
                )
            ;

        for (let _stat of _stats)
            Object.defineProperty(
                tgt
                , _stat
                , Object.getOwnPropertyDescriptor(Orig, _stat) || {}
            )


        let _insts =
            Object
                .getOwnPropertyNames(Orig.prototype)
                .filter(prop =>
                    prop != 'constructor'
                )
            ;

        for (let _inst of _insts)
            Object.defineProperty(
                tgt.prototype
                , _inst
                , Object.getOwnPropertyDescriptor(Orig.prototype, _inst) || {}
            )
    })
    return tgt as any
}

export {
    trait
}