/**
 * 
 * @param obj any key-value object
 * @param key a string that accepts dot notation to access nested values
 * @returns any value of the nested key
 * 
 * @example
 * const obj = {
 *  a: {
 *   b: {
 *   c: 'value'
 *   }
 *  }
 * }
 * 
 * dot(obj, 'a.b.c') // 'value' 
 */
export function dot(obj: any, key: string) {
  if (key.includes('.')) {
    const [first, ...rest] = key.split('.');
    if(!obj?.[first]) {
      return obj?.[key];
    }
    return dot(obj[first], rest.join('.'));
  }
  return obj?.[key];
}
