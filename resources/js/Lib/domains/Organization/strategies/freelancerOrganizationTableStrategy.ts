import { DataAction, IDataStrategy } from '$types/common/dataDisplay';
import { BaseDataDisplayStrategy } from '$lib/core/strategies/dataDisplayStrategy';
import { Organization } from '$models';
import { date } from '$lib/utils/formatting';

export class FreelancerOrganizationDataDisplayStrategy 
  extends BaseDataDisplayStrategy<Organization> 
  implements IDataStrategy<Organization>
{
  protected defaultHeaders() {
    return [
      { label: 'Name', key: 'name' },
      { label: 'Created At', key: 'created_at', formatter: date },
      { label: 'Updated At', key: 'updated_at', formatter: date },
    ];
  }

  protected defaultActions(): DataAction<Organization>[] {
    return [
      {
        label: 'View',
        href: (row: Organization) => route('organization.show', row.id),
      },
      {
        label: 'Edit',
        href: (row: Organization) => route('organization.edit', row.id),
      },
    ];
  }
} 