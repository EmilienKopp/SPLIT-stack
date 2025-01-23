import { DataAction, IDataStrategy } from '$types/common/dataDisplay';

import { BaseDataDisplayStrategy } from '$lib/core/strategies/dataDisplayStrategy';
import { Project } from '$models';
import { date } from '$lib/utils/formatting';

export class FreelancerProjectDataDisplayStrategy 
  extends BaseDataDisplayStrategy<Project> 
  implements IDataStrategy<Project>
{
  protected defaultHeaders() {
    return [
      { label: 'Name', key: 'name' },
      { label: 'Created At', key: 'created_at', formatter: date },
      { label: 'Updated At', key: 'updated_at', formatter: date },
    ];
  }

  protected defaultActions(): DataAction<Project>[] {
    return [
      {
        label: 'View',
        href: (row: Project) => route('project.show', row.id),
      },
      {
        label: 'Edit',
        href: (row: Project) => route('project.edit', row.id),
      },
    ];
  }
} 