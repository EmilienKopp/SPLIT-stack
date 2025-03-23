
export interface TranslucidEvent {
  model: string;
  id: number;
  data: any;
  event: 'created' | 'updated' | 'deleted';
}

export type TranslucidEventHandler = (event: TranslucidEvent) => void;

interface BaseModel {
  id: string | number;
  _tableName: string;
  [key: string]: any;
}

export class Translucid<T extends BaseModel> {
  #echo: typeof window.Echo;
  #instances = $state<Map<string, Map<string | number, BaseModel>>>();
  #subs = $state<Map<string | number, boolean>>();


  constructor() {
    this.#echo = window.Echo;
    if (!this.#instances) {
      this.#instances = new Map();
    }
  }

  register(model: BaseModel) {
    if (!model.id) {
      throw new Error('Cannot register a model that has no ID');
    }

    if (!this.#instances?.has(model._tableName)) {
      this.#instances?.set(model._tableName, new Map());
    }

    const tableMap = this.#instances?.get(model._tableName);
    tableMap?.set(model.id, model);
  }

  unregister(model: BaseModel) {
    if (!model.id || !this.#instances?.has(model._tableName)) {
      return;
    }
    const tableMap = this.#instances.get(model._tableName);
    tableMap?.delete(model.id);
    if (tableMap?.size === 0) {
      this.#instances.delete(model._tableName);
    }
  }

  watch(model: BaseModel) {
    if(!this.#echo) return;
    const { _tableName, id } = model;
    this.register(model);
    const updatedChannelName = `.translucid.updated.${_tableName}.${id}`;
    const channel = this.#echo.private('translucid');

    console.log("Register translucid watcher", updatedChannelName, channel);
    if (!channel) return;

    channel?.listen(updatedChannelName, (event: any) => {
      this.#instances?.get(_tableName)?.set(id, event.data);
      console.log("Reacted to update", _tableName, id, event.data);
      console.log(this.#instances);
    })
  }

  /**
   * Get a channel instance
   */
  static channel(channel: string): typeof window.Echo.Channel {
    return window.Echo?.channel(channel);
  }

  /**
   * Listen for Translucid events on the private 'translucid' channel
   */
  static listen(key: string, handlers: {
    onCreated?: TranslucidEventHandler,
    onUpdated?: TranslucidEventHandler,
    onDeleted?: TranslucidEventHandler
  }): void {
    const channel = window.Echo?.private('translucid');
    const { onCreated, onUpdated, onDeleted } = handlers;

    if (onCreated) {
      channel.listen('.translucid.created', onCreated);
    }

    if (onUpdated) {
      channel.listen('.translucid.updated.' + key, onUpdated);
    }

    if (onDeleted) {
      channel.listen('.translucid.deleted.' + key, onDeleted);
    }

    console.log('Listening for Translucid events on private channel "translucid"');
  }
}

export default Translucid;

export const translucid = new Translucid();
