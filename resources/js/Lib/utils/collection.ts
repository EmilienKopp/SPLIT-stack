

export class Collection<T> {
  private items: Array<T> = [];

  [Symbol.iterator] = this.items[Symbol.iterator];

  constructor(items: T[] = []) {
    this.items = items;
  }

  public pluck<K extends keyof T>(key: K): T[K][] {
    return this.items.map((item) => item[key]);
  }

  public unique(): Collection<T> {
    return new Collection([...new Set(this.items)]);
  }

  public uniqueByKey<K extends keyof T>(key: K): Collection<T> {
    const map = new Map<T[K], T>();
    this.items.forEach((item) => {
      map.set(item[key], item);
    });

    return new Collection([...map.values()]);
  }

  public uniqueBy(predicate: (item: T) => any): Collection<T> {
    const map = new Map<any, T>();
    this.items.forEach((item) => {
      map.set(predicate(item), item);
    });

    return new Collection([...map.values()]);
  }

  public where<K extends keyof T>(key: K, value: T[K]): Collection<T> {
    return this.filter((item) => item[key] === value);
  }

  public all(): T[] {
    return this.items;
  }

  public first(): T | undefined {
    return this.items[0];
  }

  public last(): T | undefined {
    return this.items[this.items.length - 1];
  }

  public count(): number {
    return this.items.length;
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  public push(item: T): void {
    this.items.push(item);
  }

  public pop(): T | undefined {
    return this.items.pop();
  }

  public shift(): T | undefined {
    return this.items.shift();
  }

  public unshift(item: T): void {
    this.items.unshift(item);
  }

  public find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  public filter(predicate: (item: T) => boolean): Collection<T> {
    return new Collection(this.items.filter(predicate));
  }

  public map<U>(callback: (item: T) => U): Collection<U> {
    return new Collection(this.items.map(callback));
  }

  public reduce<U>(callback: (accumulator: U, item: T) => U, initialValue: U): U {
    return this.items.reduce(callback, initialValue);
  }

  public forEach(callback: (item: T) => void): void {
    this.items.forEach(callback);
  }

  public has(item: T): boolean {
    return this.items.includes(item);
  }

  public remove(item: T): void {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  public removeAll(item: T): void {
    this.items = this.items.filter((i) => i !== item);
  }

  public collapse<U>(callback: (item: T) => U[]): Collection<U> {
    return new Collection(this.items.flatMap(callback));
  }

  public sort(callback: (a: T, b: T) => number): Collection<T> {
    return new Collection([...this.items].sort(callback));
  }

  public sortBy<K extends keyof T>(key: K): Collection<T> {
    return this.sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
  }

  public sortByDesc<K extends keyof T>(key: K): Collection<T> {
    return this.sort((a, b) => {
      if (a[key] < b[key]) return 1;
      if (a[key] > b[key]) return -1;
      return 0;
    });
  }

  public groupBy<K extends keyof T>(key: K): Map<T[K], Collection<T>> {
    const map = new Map<T[K], Collection<T>>();
    this.items.forEach((item) => {
      const value = item[key];
      if (!map.has(value)) {
        map.set(value, new Collection());
      }
      map.get(value)?.push(item);
    });

    return map;
  }

  public chunk(size: number): Collection<T>[] {
    const chunks = [];
    for (let i = 0; i < this.items.length; i += size) {
      chunks.push(new Collection(this.items.slice(i, i + size)));
    }

    return chunks;
  }

  public static make<T>(items: T[]): Collection<T> {
    return new Collection(items);
  }
  
}