export function isset<T extends unknown|undefined>(value:T):value is Exclude<T,undefined>{
  if(value!==undefined){
    return true
  }else{
    return false
  }
}
