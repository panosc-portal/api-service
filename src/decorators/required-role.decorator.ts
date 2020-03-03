

// @inject('services.AccountService') accountService: AccountService

/*
target = ?
propertyKey <= original function name
descriptor.value <= original function
*/
export function requiredRole(roleName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    //console.log(descriptor);console.log(roleName);
    let i = 1;

    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      //== Insert Pre Actions here ==
      console.log(`Role=${roleName}` + i++);
      const result = originalMethod.apply(this, args);
      //== Insert Post Actions here ==
      return result;
    };
  };
}





/*

export function deco(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  //console.log(`method "${propertyKey}" decorator: begin`);
  if (descriptor === undefined) {
    descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
  }
  const originalMethod = descriptor.value;
  let i = 0;

  descriptor.value = function (...args: any[]) {
    const id = `${propertyKey}_${i++}`;
    console.log(`${id}: begin`);
    const result = originalMethod.apply(this, args);
    console.log(`${id}: end`);
    return result;
  };
  //console.log(`method "${propertyKey}" decorator: end`);
  return descriptor;
}


*/
