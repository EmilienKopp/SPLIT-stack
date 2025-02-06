import type { TableAction, TableHeader } from '$types/common/table';

/**
 * A type that extends a given type T with an optional index property.
 */
export type Indexed<T> = T & { index?: number };

/**
 * A type that extends TableHeader with an optional index property.
 */
export type ExtendTableHeader<T> = Indexed<TableHeader<T>>;

/**
 * A type that extends TableAction with an optional index property.
 */
export type ExtendTableAction<T> = Indexed<TableAction<T>>;

/**
 * Abstract base class for table strategies.
 */
export abstract class BaseTableStrategy<T> {
  /**
   * Returns the default headers for the table.
   */
  protected abstract defaultHeaders(): TableHeader<T>[];

  /**
   * Returns the default actions for the table.
   */
  protected abstract defaultActions(): TableAction<T>[];

  #headers: TableHeader<T>[] = [];
  #actions: TableAction<T>[] = [];

  constructor() {
    this.#headers = this.defaultHeaders();
    this.#actions = this.defaultActions();
  }

  /**
   * Gets the headers for the table, optionally extending them with additional headers.
   * @param extendedHeaders - Additional headers to extend the default headers.
   */
  headers(extendedHeaders: ExtendTableHeader<T>[] = []): TableHeader<T>[] {
    return this.extendHeaders(extendedHeaders);
  }

  /**
   * Gets the actions for the table, optionally extending them with additional actions.
   * @param extendedActions - Additional actions to extend the default actions.
   */
  actions(extendedActions: ExtendTableAction<T>[] = []): TableAction<T>[] {
    return this.extendActions(extendedActions);
  }

  /**
   * Extends the default headers with additional headers.
   * @param headers - Additional headers to extend the default headers.
   */
  private extendHeaders(headers: ExtendTableHeader<T>[] = []) {
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
  private extendActions(actions: ExtendTableAction<T>[] = []) {
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
    filters: { key: string; filterHandler: TableHeader<T>['filterHandler'] }[]
  ) {
    for (const filter of filters) {
      const headerIndex = this.#headers.findIndex((h) => h.key === filter.key);
      if (headerIndex !== -1) {
        this.#headers[headerIndex].filterHandler = filter.filterHandler;
      }
    }
  }
}
