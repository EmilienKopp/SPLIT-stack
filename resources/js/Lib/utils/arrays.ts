import { dot } from './objects';

/**
 * Groups an array of objects by a specified key.
 *
 * @template T - The type of the objects in the array.
 * @param {Record<string, T>[]} arr - The array of objects to be grouped.
 * @param {string} key - The key to group the objects by. Supports nested keys using dot notation.
 * @returns {Record<string, T[]>} - An object where each key is a group and the value is an array of objects that belong to that group.
 */
export function groupBy<T>(
  arr: Record<string, T>[],
  key: string
): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const resolved = dot(item, key);
      const group = resolved ? resolved.toString() : 'undefined';
      if (!acc[group]) {
        acc[group] = [];
      }
      return {
        ...acc,
        [group]: [...acc[group], item],
      };
    },
    {} as Record<string, T[]>
  );
}


/**
 * Returns a new array containing only the unique elements from the input array.
 *
 * @param arr - The array from which to extract unique elements.
 * @returns A new array with unique elements.
 */
export function unique(arr: any[]): any[] {
  return [...new Set(arr)];
}


export function mapUnique(arr: any[], callback: (item: any) => any): any[] {
  return unique(arr.map(callback));
}

/**
 * Maps an array of objects to an array of values corresponding to a specified key.
 *
 * @template T - The type of the objects in the array.
 * @template K - The key of the property to map.
 * @param {T[]} arr - The array of objects to map.
 * @param {K} key - The key of the property to extract values from.
 * @returns {T[K][]} An array of values corresponding to the specified key.
 */
export function mapColumn<T extends Record<K, any>, K extends keyof T>(
  arr: T[],
  key: K
): T[K][] {
  return arr.map((item: T) => item[key]);
}