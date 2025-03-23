import { ProjectBase } from "./Project";

export class Project extends ProjectBase {
  _tableName = 'projects';

  constructor(data: ProjectBase) {
    super(data);
    this.id = data?.id;
  }
}
