import { BaseDataDisplayStrategy } from '$lib/core/strategies/dataDisplayStrategy';
import { DataAction } from '$types/common/dataDisplay';
import { Project } from '$models';

export class DefaultProjectTableStrategy extends BaseDataDisplayStrategy<Project> {
  protected defaultHeaders() {
    return [];
  }

  protected defaultActions(): DataAction<Project>[] {
    return [];
  }
}