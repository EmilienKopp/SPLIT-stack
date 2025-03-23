
export interface TranslucidEvent {
  model: string;
  id: number;
  data: any;
  event: 'created' | 'updated' | 'deleted';
}

export type TranslucidEventHandler = (event: TranslucidEvent) => void;

export class Translucid {
  static #echo: typeof window.Echo;

  static {
    this.#echo = window.Echo;
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
  static listen(key:string, handlers: {
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
