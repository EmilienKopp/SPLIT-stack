import { BaseDataDisplayStrategy } from '$lib/base/strategies/dataDisplayStrategy';
import { Context } from '$lib/core/contexts/context';
import { Organization } from '$models';

export class OrganizationContext implements Context<Organization> {
  strategy: BaseDataDisplayStrategy<Organization>;

  constructor(role: string) {
    this.strategy = this.getStrategyForRole(role);
  }

  getStrategyForRole(role: string): BaseDataDisplayStrategy<Organization> {
    switch (role) {
      case 'admin':
        return new AdminOrganizationTableStrategy();
      case 'freelancer':
        return new FreelancerOrganizationTableStrategy();
      case 'employer':
        return new EmployerOrganizationTableStrategy();
      default:
        return new DefaultOrganizationDataDisplayStrategy();
    }
  }
} 