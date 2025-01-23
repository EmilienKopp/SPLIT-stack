import type { DataAction, DataHeader, ExtendedAction, ExtendedHeader } from '$types/common/dataDisplay';

/**
 * Abstract base class for table strategies.
 */
export abstract class BaseDataDisplayStrategy<T> {
  /**
   * Returns the default headers for the table.
   */
  protected abstract defaultHeaders(): DataHeader<T>[];

  /**
   * Returns the default actions for the table.
   */
  protected abstract defaultActions(): DataAction<T>[];

  #headers: DataHeader<T>[] = [];
  #actions: DataAction<T>[] = [];

  constructor() {
    this.#headers = this.defaultHeaders();
    this.#actions = this.defaultActions();
  }

  /**
   * Gets the headers for the table, optionally extending them with additional headers.
   * @param extendedHeaders - Additional headers to extend the default headers.
   */
  headers(extendedHeaders: ExtendedHeader<T>[] = []): DataHeader<T>[] {
    return this.extendHeaders(extendedHeaders);
  }

  /**
   * Gets the actions for the table, optionally extending them with additional actions.
   * @param extendedActions - Additional actions to extend the default actions.
   */
  actions(extendedActions: ExtendedAction<T>[] = []): DataAction<T>[] {
    return this.extendActions(extendedActions);
  }

  /**
   * Extends the default headers with additional headers.
   * @param headers - Additional headers to extend the default headers.
   */
  private extendHeaders(headers: ExtendedHeader<T>[] = []) {
    for (const header of headers) {
      const headerIndex = this.#headers.findIndex((h) => h.key === header.key);
      if (headerIndex !== -1) {
        this.#headers[headerIndex] = {
          ...this.#headers[headerIndex],
          ...header,
        };
        continue;
      }
      this.#headers.splice(header.index ?? 0, 0, header);
    }
    return this.#headers;
  }

  /**
   * Extends the default actions with additional actions.
   * @param actions - Additional actions to extend the default actions.
   */
  private extendActions(actions: ExtendedAction<T>[] = []) {
    for (const action of actions) {
      const actionIndex = this.#actions.findIndex(
        (a) => a.label === action.label
      );
      if (actionIndex !== -1) {
        this.#actions[actionIndex] = {
          ...this.#actions[actionIndex],
          ...action,
        };
        continue;
      }
      this.#actions.splice(action.index ?? 0, 0, action);
    }
    return this.#actions;
  }

  /**
   * Sets the filters for the table headers.
   * @param filters - An array of objects containing the key and filter handler for each header.
   */
  setFilters(
    filters: { key: string; filterHandler: DataHeader<T>['filterHandler'] }[]
  ) {
    for (const filter of filters) {
      const headerIndex = this.#headers.findIndex((h) => h.key === filter.key);
      if (headerIndex !== -1) {
        this.#headers[headerIndex].filterHandler = filter.filterHandler;
      }
    }
  }
}
