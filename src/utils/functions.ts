export const suspender = async (timeout: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, timeout);
  });
};

export const deepcopy = (target: any) => {
  switch(true) {
    case target instanceof Map: {
      let map = new Map();
      for(let [key, value] of Array.from(target) as Array<any>) {
        map.set(key, deepcopy(value))
      }

      return map;
    }

    case target instanceof Object: {
      let object: any = {};
      for(let key in target) {
        object[key] = deepcopy(target[key]);
      }

      return object;
    }

    default: {
      return target;
    }
  }
}