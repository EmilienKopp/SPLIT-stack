import Translucid from "$lib/translucid.svelte";
import { ProjectBase } from "./Project";

export class Project extends ProjectBase {
  static #table = 'projects';

  constructor(data: ProjectBase) {
    super(data);
    this.id = data?.id;
  }

  translucid() {
    console.log("registering translucid for project", this.id);
    Translucid.listen(`translucid.updated.${Project.#table}.${this.id}`, {
      onUpdated: (event) => {
        console.log(`Project ${this.id} updated`, event);
      },
      onDeleted: (event) => {
        console.log(`Project ${this.id} deleted`, event);
      }
    });
    return this;
  }
}
