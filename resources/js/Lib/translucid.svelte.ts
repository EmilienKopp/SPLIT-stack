import { SvelteMap } from 'svelte/reactivity';

// ---------------------------------------------------------------------------
// Normalized event payload types (match backend broadcastWith envelopes)
// ---------------------------------------------------------------------------

export interface TranslucidCreatedPayload {
  /** Table name (e.g. "posts") */
  type: string;
  /** Fully-qualified PHP class name */
  model: string;
  id: string | number;
  op: 'created';
  /** Full model attributes */
  data: Record<string, any>;
}

export interface TranslucidUpdatedPayload {
  type: string;
  model: string;
  id: string | number;
  op: 'updated';
  /** Only the changed fields (from Model::getChanges()) */
  changes: Record<string, any>;
}

export interface TranslucidDeletedPayload {
  type: string;
  model: string;
  id: string | number;
  op: 'deleted';
}

export type TranslucidPayload =
  | TranslucidCreatedPayload
  | TranslucidUpdatedPayload
  | TranslucidDeletedPayload;

/** @deprecated Use TranslucidPayload union types instead */
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
   * Setup real-time watching for a model (updates + deletes).
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

    const updateSub = `.translucid.updated.${tableName}.${id}`;
    const deleteSub = `.translucid.deleted.${tableName}.${id}`;

    const channel = this.#echo.private('translucid');
    if (!channel) return;

    if (!this.hasSubscription(updateSub)) {
      channel.listen(updateSub, (event: TranslucidUpdatedPayload) => {
        let entry = this.retrieveEntryFromSub(updateSub);
        if (!entry) {
          console.warn('No reference found for', updateSub);
          return;
        }
        // Update the array if it exists
        if (this.#arrays[tableName] && entry.index !== undefined) {
          this.#arrays[tableName][entry.index] = {
            ...this.#arrays[tableName][entry.index],
            ...event.changes,
          };
        }

        // Always update the reference
        entry.ref = { ...entry.ref, ...event.changes };
        this.#updates.get(tableName)?.set(id, entry);
      });
    }

    // Register per-record delete listener (idempotent via Set key)
    const deleteKey = `${tableName}.${id}`;
    if (!this.#registeredDeletes.has(deleteKey)) {
      this.#registeredDeletes.add(deleteKey);

      channel.listen(deleteSub, (_event: TranslucidDeletedPayload) => {
        if (this.#arrays[tableName]) {
          const idx = this.#arrays[tableName].findIndex((m) => m.id === id);
          if (idx !== -1) {
            this.#arrays[tableName].splice(idx, 1);
          }
        }

        const tableMap = this.#updates.get(tableName);
        if (tableMap) {
          tableMap.delete(id);
        }
      });
    }
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

    const channel = this.#echo.private('translucid');
    if (!channel) return;

    channel.stopListening(`.translucid.updated.${tableName}.${id}`);
    channel.stopListening(`.translucid.deleted.${tableName}.${id}`);

    this.#registeredDeletes.delete(`${tableName}.${id}`);
  }

  /**
   * Register for delete events on the current table.
   * Per-record delete listeners are now registered automatically by watch();
   * this method is kept for backwards compatibility.
   */
  registerForDelete(): Translucid {
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

// ---------------------------------------------------------------------------
// Standalone functional API
// ---------------------------------------------------------------------------

/**
 * URL query-string params that are never treated as model field filters.
 * Extend this list as needed.
 */
const IGNORED_FILTER_PARAMS = new Set([
  'page', 'sort', 'order', 'direction', 'per_page', 'limit', 'offset',
]);

/**
 * Build a predicate map from the current page URL query string.
 *
 * Convention:
 *   ?field=value        → strict equality
 *   ?field[]=a&field[]=b → field must be in {a, b}
 *
 * Keys are sorted so parameter order does not affect matching.
 */
function buildUrlPredicate(): Map<string, string | string[]> {
  const params = new URLSearchParams(window.location.search);
  const predicate = new Map<string, string | string[]>();

  // Collect & sort keys for canonicalization
  const keys = Array.from(new Set(params.keys())).sort();

  for (const key of keys) {
    if (IGNORED_FILTER_PARAMS.has(key)) continue;

    if (key.endsWith('[]')) {
      // ?field[]=a&field[]=b → array filter
      const field = key.slice(0, -2);
      predicate.set(field, params.getAll(key));
    } else {
      const values = params.getAll(key);
      predicate.set(key, values.length > 1 ? values : values[0]);
    }
  }

  return predicate;
}

/**
 * Test whether a model's data object satisfies every entry in the predicate.
 * All comparisons are string-based (no numeric coercion).
 */
function matchesPredicate(
  data: Record<string, any>,
  predicate: Map<string, string | string[]>
): boolean {
  for (const [field, expected] of predicate) {
    if (!(field in data)) return false;
    const actual = String(data[field]);
    if (Array.isArray(expected)) {
      if (!expected.includes(actual)) return false;
    } else {
      if (actual !== expected) return false;
    }
  }
  return true;
}

// ---------------------------------------------------------------------------
// watchCollection
// ---------------------------------------------------------------------------

export interface WatchCollectionOpts {
  /**
   * Called when a created event arrives whose payload passes the URL-filter
   * predicate derived from the current page's query string.
   */
  onCreated: (payload: TranslucidCreatedPayload) => void;
}

/**
 * Subscribe to table-wide `created` events for `table`.
 *
 * Membership is determined client-side by matching the created model's data
 * against the current URL query string (see URL convention in docs).
 *
 * @returns Unsubscribe function – call it in your component's cleanup/onDestroy.
 *
 * @example
 * const stop = watchCollection('posts', {
 *   onCreated(payload) { items = [payload.data, ...items]; }
 * });
 * onDestroy(stop);
 */
export function watchCollection(
  table: string,
  opts: WatchCollectionOpts
): () => void {
  if (!window.Echo) {
    console.warn('watchCollection: Echo is not available');
    return () => {};
  }

  const predicate = buildUrlPredicate();
  const channel = window.Echo.private('translucid');
  const eventName = `.translucid.created.${table}`;

  channel.listen(eventName, (event: TranslucidCreatedPayload) => {
    if (matchesPredicate(event.data, predicate)) {
      opts.onCreated(event);
    }
  });

  return () => {
    channel.stopListening(eventName);
  };
}

// ---------------------------------------------------------------------------
// watchId
// ---------------------------------------------------------------------------

export interface WatchIdOpts {
  /** Called with the changed fields when a per-record updated event arrives. */
  onUpdated?: (payload: TranslucidUpdatedPayload) => void;
  /** Called when a per-record deleted event arrives. */
  onDeleted?: (payload: TranslucidDeletedPayload) => void;
}

/**
 * Subscribe to per-record `updated` and `deleted` events for a known model.
 *
 * @returns Unsubscribe function – call it in your component's cleanup/onDestroy.
 *
 * @example
 * const stop = watchId('posts', post.id, {
 *   onUpdated(payload) { Object.assign(post, payload.changes); },
 *   onDeleted()        { goto('/posts'); },
 * });
 * onDestroy(stop);
 */
export function watchId(
  table: string,
  id: string | number,
  opts: WatchIdOpts
): () => void {
  if (!window.Echo) {
    console.warn('watchId: Echo is not available');
    return () => {};
  }

  const channel = window.Echo.private('translucid');
  const updatedEvent = `.translucid.updated.${table}.${id}`;
  const deletedEvent = `.translucid.deleted.${table}.${id}`;

  if (opts.onUpdated) {
    channel.listen(updatedEvent, (event: TranslucidUpdatedPayload) => {
      opts.onUpdated!(event);
    });
  }

  if (opts.onDeleted) {
    channel.listen(deletedEvent, (event: TranslucidDeletedPayload) => {
      opts.onDeleted!(event);
    });
  }

  return () => {
    if (opts.onUpdated) channel.stopListening(updatedEvent);
    if (opts.onDeleted) channel.stopListening(deletedEvent);
  };
}
