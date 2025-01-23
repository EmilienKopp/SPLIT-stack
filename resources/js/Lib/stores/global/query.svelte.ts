
class QueryStore {
  #query = $state(new URLSearchParams(location.search));
  constructor() { }

  param(key: string) {
    return this.#query.get(key);
  }

  setParam(key: string, value: string) {
    this.#query.set(key, value);
    console.log(this.#query.toString());
    history.pushState({}, '', `${location.pathname}?${this.#query.toString()}`);
  }

  clearParam(key: string) {
    this.#query.delete(key);
    history.pushState({}, '', `${location.pathname}?${this.#query.toString()}`);
  }
}

export const query = $state(new QueryStore());