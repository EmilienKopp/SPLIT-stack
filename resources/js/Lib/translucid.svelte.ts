import { SvelteMap } from 'svelte/reactivity';

export interface TranslucidEvent {
  model: string;
  id: number;
  data: any;
  event: 'created' | 'updated' | 'deleted';
}

export type TranslucidEventHandler = (event: TranslucidEvent) => void;

interface BaseModel {
  id: string | number;
  [key: string]: any;
}

interface ModelEntry {
  id: string | number;
  ref: BaseModel;
  index?: number;
}

/**
 * Translucid - A utility class for real-time model synchronization
 *
 * This class uses Laravel Echo to listen for model updates and deletions
 * across browser tabs, providing real-time synchronization of data.
 */
export class Translucid {
  #echo: typeof window.Echo;
  #updates = $state<SvelteMap<string, SvelteMap<string | number, ModelEntry>>>(
    new SvelteMap()
  );
  #registeredDeletes = $state<Set<string>>(new Set());
  #currentTable: string | null = null;
  #arrays = $state<Record<string, BaseModel[]>>({});
  static #instance: Translucid | null = null;

  private constructor() {
    this.#echo = window.Echo;
  }

  /**
   * Get or create the singleton instance of Translucid
   */
  static acquire(): Translucid {
    if (!this.#instance) {
      this.#instance = new Translucid();
    }
    return this.#instance;
  }

  /**
   * Set the current table context for subsequent operations
   */
  table(tableName: string): Translucid {
    this.#currentTable = tableName;
    if (!this.#updates.has(tableName)) {
      this.#updates.set(tableName, new SvelteMap());
    }
    return this;
  }

  /**
   * Register a model to be watched for updates
   */
  register(model: BaseModel, index?: number): void {
    if (!model.id || !this.#currentTable) {
      throw new Error('Cannot register a model without ID or current table');
    }

    if (!this.#updates.has(this.#currentTable)) {
      this.table(this.#currentTable);
    }

    const tableMap = this.#updates.get(this.#currentTable);
    tableMap?.set(model.id, {
      id: model.id,
      ref: model,
      index,
    });
  }

  /**
   * Unregister a model from being watched
   */
  unregister(model: BaseModel): void {
    if (!model.id || !this.#currentTable) {
      return;
    }

    if (!this.#updates.has(this.#currentTable)) {
      return;
    }

    const tableMap = this.#updates.get(this.#currentTable);
    tableMap?.delete(model.id);

    if (tableMap?.size === 0) {
      this.#updates.delete(this.#currentTable);
    }
  }

  /**
   * Setup real-time watching for a model
   */
  watch(model: BaseModel, index?: number): void {
    if (!this.echoReady()) return;

    const tableName = this.#currentTable;
    const { id } = model;

    if (!tableName || !id) {
      console.warn('No ID or tableName found for watch');
      return;
    }

    this.register(model, index);

    const subscription = `.translucid.updated.${tableName}.${id}`;
    if (this.hasSubscription(subscription)) {
      return;
    }

    const channel = this.#echo.private('translucid');
    if (!channel) return;

    channel.listen(subscription, (event: any) => {
      let entry = this.retrieveEntryFromSub(subscription);
      if (!entry) {
        console.warn('No reference found for', subscription);
        return;
      }

      // Update the array if it exists
      if (this.#arrays[tableName] && entry.index !== undefined) {
        this.#arrays[tableName][entry.index] = {
          ...this.#arrays[tableName][entry.index],
          ...event.data,
        };
      }

      // Always update the reference
      entry.ref = { ...entry.ref, ...event.data };
      this.#updates.get(tableName)?.set(id, entry);
    });
  }

  /**
   * Watch an entire array of models
   */
  watchAll(arr: BaseModel[]): BaseModel[] {
    if (!this.echoReady() || !this.#currentTable) {
      return arr;
    }

    const tableName = this.#currentTable;

    // Store a copy of the array
    this.#arrays[tableName] = [...arr];

    if (!this.#updates.has(tableName)) {
      this.table(tableName);
    }

    // Watch each model in the array
    arr.forEach((model, idx) => {
      this.watch(model, idx);
    });

    // Register for delete events if not already registered
    this.registerForDelete();

    return this.#arrays[tableName];
  }

  /**
   * Stop watching a model
   */
  unwatch(model: BaseModel): void {
    if (!this.echoReady() || !this.#currentTable) return;

    const { id } = model;
    const tableName = this.#currentTable;

    this.unregister(model);

    const channelName = `.translucid.updated.${tableName}.${id}`;
    const channel = this.#echo.private('translucid');

    if (!channel) return;
    channel.stopListening(channelName);
  }

  /**
   * Register for delete events on the current table
   */
  registerForDelete(): Translucid {
    if (!this.echoReady() || !this.#currentTable) {
      return this;
    }

    const tableName = this.#currentTable;

    // Only register once per table
    if (this.#registeredDeletes.has(tableName)) {
      return this;
    }

    this.#registeredDeletes.add(tableName);

    const channel = this.#echo.private('translucid');
    const deleteEvent = `.translucid.deleted.${tableName}`;

    channel?.listen(deleteEvent, (event: any) => {
      const { id } = event;
      if (this.#arrays[tableName]) {
        const index = this.#arrays[tableName].findIndex(
          (model) => model.id === id
        );
        if (index !== -1) {
          this.#arrays[tableName].splice(index, 1);
        }
      }

      const updateInstancesMap = this.#updates.get(tableName);
      if (updateInstancesMap) {
        updateInstancesMap.delete(id);
      }
    });

    return this;
  }

  /**
   * Parse the subscription name to extract tableName and id
   * @format .translucid.updated.tableName.id | .translucid.deleted.tableName
   */
  private parseSubscriptionName(subscriptionString: string): [string, string] {
    const parts = subscriptionString.split('.');
    if (parts.length >= 4) {
      return [parts[3], parts[4]];
    } else if (parts.length === 4) {
      return [parts[3], ''];
    }
    return ['', ''];
  }

  /**
   * Retrieve the entry from a subscription string
   */
  private retrieveEntryFromSub(subscriptionString: string): ModelEntry | null {
    const [tableName, id] = this.parseSubscriptionName(subscriptionString);
    const tableMap = this.#updates.get(tableName);

    if (!tableMap) return null;

    // Try string id first, then number id
    return tableMap.get(id) || tableMap.get(parseInt(id, 10)) || null;
  }

  /**
   * Check if a subscription already exists
   */
  private hasSubscription(subscriptionString: string): boolean {
    const [tableName, id] = this.parseSubscriptionName(subscriptionString);
    return (
      this.#updates.has(tableName) && Boolean(this.#updates.get(tableName)?.has(id))
    );
  }

  /**
   * Check if Echo is ready to use
   */
  private echoReady(): boolean {
    if (!this.#echo) {
      this.#echo = window.Echo;
      if (!this.#echo) {
        console.warn('Echo is not available');
        return false;
      }
    }
    return true;
  }

  /**
   * Get a channel instance (static utility method)
   */
  static channel(channel: string): typeof window.Echo.Channel {
    return window.Echo?.channel(channel);
  }

  get updates(): SvelteMap<string, SvelteMap<string | number, ModelEntry>> {
    return this.#updates;
  }

  get arrays(): Record<string, BaseModel[]> {
    return this.#arrays;
  }

  get registeredDeletes(): Set<string> {
    return this.#registeredDeletes;
  }
}

export const translucid = Translucid.acquire();
